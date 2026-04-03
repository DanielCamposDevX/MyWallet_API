import type { Request } from "express";
import { ValidationError, type ObjectSchema } from "yup";
import { AppError } from "../../errors/AppError.js";

type SchemaMap = {
  body?: ObjectSchema<any>;
  query?: ObjectSchema<any>;
  params?: ObjectSchema<any>;
  headers?: ObjectSchema<any>;
};

function applyStrictMode(schema: ObjectSchema<any> | undefined) {
  if (!schema) {
    return undefined;
  }

  if (schema.type === "object" && typeof schema.noUnknown === "function") {
    return schema.noUnknown(true);
  }

  return schema;
}

async function validateYupSchema(request: Request, schemas: SchemaMap) {
  try {
    const bodySchema = applyStrictMode(schemas.body);
    const querySchema = applyStrictMode(schemas.query);
    const paramsSchema = applyStrictMode(schemas.params);
    const headersSchema = applyStrictMode(schemas.headers);

    if (bodySchema) {
      request.body = await bodySchema.validate(request.body, {
        abortEarly: false,
        stripUnknown: false,
      });
    }

    if (querySchema) {
      request.query = (await querySchema.validate(request.query, {
        abortEarly: false,
        stripUnknown: false,
      })) as Request["query"];
    }

    if (paramsSchema) {
      request.params = (await paramsSchema.validate(request.params, {
        abortEarly: false,
        stripUnknown: false,
      })) as Request["params"];
    }

    if (headersSchema) {
      request.headers = (await headersSchema.validate(request.headers, {
        abortEarly: false,
        stripUnknown: false,
      })) as Request["headers"];
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      const message = error.errors.join("; ");
      throw new AppError(message || "Validation failed", 400);
    }

    throw error;
  }
}

export { validateYupSchema };
