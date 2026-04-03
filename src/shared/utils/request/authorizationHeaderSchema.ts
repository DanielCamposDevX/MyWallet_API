import * as yup from "yup";

const authorizationHeaderSchema = yup.object({
  authorization: yup
    .string()
    .matches(/^Bearer\s.+$/, "authorization must be in Bearer <token> format")
    .required()
    .label("authorization"),
});

export type AuthorizationHeader = yup.InferType<typeof authorizationHeaderSchema>;

export { authorizationHeaderSchema };
