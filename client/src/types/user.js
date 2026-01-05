export class User {
  constructor(id, name, email, info, role, permission) {
    this.user_id = id;
    this.user_name = name;
    this.email = email;
    this.info = info;
    this.role = role;
    this.permission = permission;
    // this.scope = scope
  }
}

export const ROLE = {
  ADMIN: "admin",
  PRO_USER: "pro_user",
  USER: "user",
};

export const PERMISSION = {
  PROBLEM_CREATE: "problem:create",
  PROBLEM_EDIT: "problem:edit",
  CONTEST_CREATE: "contest:create",
};
