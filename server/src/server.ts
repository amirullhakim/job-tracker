import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "./lib/prisma.js";
import {
  authMiddleware,
  type AuthenticatedRequest,
} from "./middleware/authMiddleware.js";

const app = express();

const port = Number(process.env.PORT) || 5000;

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const jwtSecret: string =
  process.env.JWT_SECRET ?? "";

if (!jwtSecret) {
  throw new Error(
    "JWT_SECRET is not configured."
  );
}

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      // Examples: Render health checks,
      // Postman, curl, server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.warn(
        `Blocked CORS origin: ${origin}`
      );

      return callback(null, false);
    },
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

/* =========================================================
   HELPERS
========================================================= */

function cleanString(value: unknown) {
  return String(value ?? "").trim();
}

function nullableString(value: unknown) {
  const valueString =
    cleanString(value);

  return valueString === ""
    ? null
    : valueString;
}

function buildApplicationData(
  body: any
) {
  const companyName =
    cleanString(body.companyName);

  const position =
    cleanString(body.position);

  const dateAppliedString =
    cleanString(body.dateApplied);

  if (
    !companyName ||
    !position ||
    !dateAppliedString
  ) {
    return {
      error:
        "Company name, position and date applied are required.",
      data: null,
    };
  }

  const dateApplied = new Date(
    dateAppliedString
  );

  if (
    Number.isNaN(
      dateApplied.getTime()
    )
  ) {
    return {
      error:
        "Date applied is invalid.",
      data: null,
    };
  }

  let followUpDate:
    | Date
    | null = null;

  const followUpDateString =
    cleanString(
      body.followUpDate
    );

  if (followUpDateString) {
    const parsedFollowUpDate =
      new Date(
        followUpDateString
      );

    if (
      Number.isNaN(
        parsedFollowUpDate.getTime()
      )
    ) {
      return {
        error:
          "Follow-up date is invalid.",
        data: null,
      };
    }

    followUpDate =
      parsedFollowUpDate;
  }

  return {
    error: null,

    data: {
      companyName,
      position,

      location:
        nullableString(
          body.location
        ),

      workMode:
        nullableString(
          body.workMode
        ),

      employmentType:
        nullableString(
          body.employmentType
        ),

      dateApplied,

      platform:
        nullableString(
          body.platform
        ),

      applicationUrl:
        nullableString(
          body.applicationUrl
        ),

      companyUrl:
        nullableString(
          body.companyUrl
        ),

      status:
        cleanString(
          body.status
        ) || "Applied",

      salary:
        nullableString(
          body.salary
        ),

      jobDescription:
        nullableString(
          body.jobDescription
        ),

      requirements:
        nullableString(
          body.requirements
        ),

      responsibilities:
        nullableString(
          body.responsibilities
        ),

      skills:
        nullableString(
          body.skills
        ),

      followUpDate,

      remarks:
        nullableString(
          body.remarks
        ),
    },
  };
}

/* =========================================================
   HEALTH
========================================================= */

app.get(
  "/api/health",
  async (_req, res) => {
    try {
      await prisma.$queryRaw`
        SELECT 1
      `;

      return res.json({
        ok: true,
        database: "connected",
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          ok: false,
          database:
            "unavailable",
        });
    }
  }
);

/* =========================================================
   AUTH — REGISTER
========================================================= */

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const name =
        cleanString(
          req.body.name
        );

      const email =
        cleanString(
          req.body.email
        ).toLowerCase();

      const password =
        String(
          req.body.password ??
            ""
        );

      if (
        !name ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Name, email and password are required.",
          });
      }

      if (
        password.length < 6
      ) {
        return res
          .status(400)
          .json({
            message:
              "Password must be at least 6 characters.",
          });
      }

      const existingUser =
        await prisma.user.findUnique(
          {
            where: {
              email,
            },
          }
        );

      if (existingUser) {
        return res
          .status(409)
          .json({
            message:
              "An account with this email already exists.",
          });
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      const user =
        await prisma.user.create(
          {
            data: {
              name,
              email,
              passwordHash,
            },

            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          }
        );

      const token = jwt.sign(
        {
          userId: user.id,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        }
      );

      return res
        .status(201)
        .json({
          message:
            "Registration successful.",

          user,
          token,
        });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not create account.",
        });
    }
  }
);

/* =========================================================
   AUTH — LOGIN
========================================================= */

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const email =
        cleanString(
          req.body.email
        ).toLowerCase();

      const password =
        String(
          req.body.password ??
            ""
        );

      if (
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({
            message:
              "Email and password are required.",
          });
      }

      const user =
        await prisma.user.findUnique(
          {
            where: {
              email,
            },
          }
        );

      if (!user) {
        return res
          .status(401)
          .json({
            message:
              "Invalid email or password.",
          });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (
        !passwordMatches
      ) {
        return res
          .status(401)
          .json({
            message:
              "Invalid email or password.",
          });
      }

      const token =
        jwt.sign(
          {
            userId: user.id,
          },
          jwtSecret,
          {
            expiresIn: "7d",
          }
        );

      return res.json({
        message:
          "Login successful.",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt:
            user.createdAt,
        },

        token,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not log in.",
        });
    }
  }
);

/* =========================================================
   AUTH — CURRENT USER
========================================================= */

app.get(
  "/api/auth/me",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      const user =
        await prisma.user.findUnique(
          {
            where: {
              id: userId,
            },

            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        );

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "User not found.",
          });
      }

      return res.json({
        user,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not load user.",
        });
    }
  }
);

/* =========================================================
   AUTH — UPDATE PROFILE
========================================================= */

app.put(
  "/api/auth/profile",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      const name =
        cleanString(
          req.body.name
        );

      const email =
        cleanString(
          req.body.email
        ).toLowerCase();

      if (
        !name ||
        !email
      ) {
        return res
          .status(400)
          .json({
            message:
              "Name and email are required.",
          });
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(
          email
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Please enter a valid email address.",
          });
      }

      const existingUser =
        await prisma.user.findFirst(
          {
            where: {
              email,

              NOT: {
                id: userId,
              },
            },
          }
        );

      if (existingUser) {
        return res
          .status(409)
          .json({
            message:
              "An account with this email already exists.",
          });
      }

      const user =
        await prisma.user.update(
          {
            where: {
              id: userId,
            },

            data: {
              name,
              email,
            },

            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        );

      return res.json({
        message:
          "Profile updated successfully.",

        user,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not update profile.",
        });
    }
  }
);

/* =========================================================
   AUTH — LOGOUT
========================================================= */

app.post(
  "/api/auth/logout",
  authMiddleware,
  (_req, res) => {
    return res.json({
      message:
        "Logout successful.",
    });
  }
);

/* =========================================================
   APPLICATIONS — GET ALL
========================================================= */

app.get(
  "/api/applications",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      const applications =
        await prisma.application.findMany(
          {
            where: {
              userId,
            },

            orderBy: {
              dateApplied:
                "desc",
            },
          }
        );

      return res.json({
        applications,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not load applications.",
        });
    }
  }
);

/* =========================================================
   APPLICATIONS — GET ONE
========================================================= */

app.get(
  "/api/applications/:id",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      const id = Number(
        req.params.id
      );

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      if (
        !Number.isInteger(id)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid application ID.",
          });
      }

      const application =
        await prisma.application.findFirst(
          {
            where: {
              id,
              userId,
            },
          }
        );

      if (
        !application
      ) {
        return res
          .status(404)
          .json({
            message:
              "Application not found.",
          });
      }

      return res.json({
        application,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not load application.",
        });
    }
  }
);

/* =========================================================
   APPLICATIONS — CREATE
========================================================= */

app.post(
  "/api/applications",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      const result =
        buildApplicationData(
          req.body
        );

      if (
        result.error ||
        !result.data
      ) {
        return res
          .status(400)
          .json({
            message:
              result.error ||
              "Invalid application data.",
          });
      }

      const application =
        await prisma.application.create(
          {
            data: {
              ...result.data,
              userId,
            },
          }
        );

      return res
        .status(201)
        .json({
          message:
            "Application added successfully.",

          application,
        });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not create application.",
        });
    }
  }
);

/* =========================================================
   APPLICATIONS — UPDATE
========================================================= */

app.put(
  "/api/applications/:id",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      const id = Number(
        req.params.id
      );

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      if (
        !Number.isInteger(id)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid application ID.",
          });
      }

      const existingApplication =
        await prisma.application.findFirst(
          {
            where: {
              id,
              userId,
            },
          }
        );

      if (
        !existingApplication
      ) {
        return res
          .status(404)
          .json({
            message:
              "Application not found.",
          });
      }

      const result =
        buildApplicationData(
          req.body
        );

      if (
        result.error ||
        !result.data
      ) {
        return res
          .status(400)
          .json({
            message:
              result.error ||
              "Invalid application data.",
          });
      }

      const application =
        await prisma.application.update(
          {
            where: {
              id,
            },

            data:
              result.data,
          }
        );

      return res.json({
        message:
          "Application updated successfully.",

        application,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not update application.",
        });
    }
  }
);

/* =========================================================
   APPLICATIONS — DELETE
========================================================= */

app.delete(
  "/api/applications/:id",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      const id = Number(
        req.params.id
      );

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      if (
        !Number.isInteger(id)
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid application ID.",
          });
      }

      const result =
        await prisma.application.deleteMany(
          {
            where: {
              id,
              userId,
            },
          }
        );

      if (
        result.count === 0
      ) {
        return res
          .status(404)
          .json({
            message:
              "Application not found.",
          });
      }

      return res.json({
        message:
          "Application deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not delete application.",
        });
    }
  }
);

/* =========================================================
   DASHBOARD
========================================================= */

app.get(
  "/api/dashboard",
  authMiddleware,
  async (
    req: AuthenticatedRequest,
    res
  ) => {
    try {
      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            message:
              "Authentication required.",
          });
      }

      const [
        total,
        interviews,
        offers,
        rejected,
        recent,
        groupedStatuses,
      ] =
        await Promise.all([
          prisma.application.count(
            {
              where: {
                userId,
              },
            }
          ),

          prisma.application.count(
            {
              where: {
                userId,
                status:
                  "Interview",
              },
            }
          ),

          prisma.application.count(
            {
              where: {
                userId,
                status:
                  "Offer",
              },
            }
          ),

          prisma.application.count(
            {
              where: {
                userId,
                status:
                  "Rejected",
              },
            }
          ),

          prisma.application.findMany(
            {
              where: {
                userId,
              },

              orderBy: {
                createdAt:
                  "desc",
              },

              take: 5,
            }
          ),

          prisma.application.groupBy(
            {
              by: [
                "status",
              ],

              where: {
                userId,
              },

              _count: {
                _all: true,
              },
            }
          ),
        ]);

      const statusCounts =
        groupedStatuses.reduce<
          Record<
            string,
            number
          >
        >(
          (
            accumulator,
            item
          ) => {
            accumulator[
              item.status
            ] =
              item._count._all;

            return accumulator;
          },
          {}
        );

      return res.json({
        total,
        interviews,
        offers,
        rejected,
        recent,
        statusCounts,
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({
          message:
            "Could not load dashboard.",
        });
    }
  }
);

/* =========================================================
   SERVER
========================================================= */

app.listen(
  port,
  "0.0.0.0",
  () => {
    console.log(
      `Job Tracker API running on port ${port}`
    );

    console.log(
      "Allowed CORS origins:",
      allowedOrigins
    );
  }
);

process.on(
  "SIGINT",
  async () => {
    await prisma.$disconnect();

    process.exit(0);
  }
);

process.on(
  "SIGTERM",
  async () => {
    await prisma.$disconnect();

    process.exit(0);
  }
);