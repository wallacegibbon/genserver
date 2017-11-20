class UserMiddlewareError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "UserMiddlewareError", message);
  }
}


class RouteError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "RouteError", message);
  }
}


class ActionError extends Error {
  constructor(message) {
    super();
    errorObjInitializer.call(this, "ActionError", message);
  }
}


function errorObjInitializer(name, message) {
  this.name = name;
  if (message instanceof Error)
    this.message = message.message;
  else
    this.message = message;
}


module.exports = {
  UserMiddlewareError,
  RouteError,
  ActionError,
};
