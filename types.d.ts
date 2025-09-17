import { Connection } from "mongoose";

//to avoid multiple connections in development due to hot reloading
//attach a mongoose object to the global scope.
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

export {};