const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const exisitingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (exisitingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room };

  users.push(user);
  console.log("addUser: users", users);

  return { user };
};

const removeUser = (id) => {
  console.log("removeUser: id", id, "users", users);
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  console.log("removeUser: index", index);
  if (index !== -1) {
    let ret = users.splice(index, 1)[0];
    console.log("removeUser: ret", ret);
    return ret;
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
