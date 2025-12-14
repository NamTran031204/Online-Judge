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