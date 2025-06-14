import * as Yup from "yup";

export const loginSchema = Yup.object({
    email:Yup.string().email("Invalid Email").required("Email is required"),
    password:Yup.string().required("Password is required")
})

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(1, "Last name must be at least 1 character")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(12, "Password must be at most 12 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});