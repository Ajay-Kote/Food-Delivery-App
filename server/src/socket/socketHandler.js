const registerSocketHandlers = (io, socket) => {
  console.log('Socket connected', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('agent:shareLocation', (payload) => {
    const { lat, lng, customerId } = payload;
    if (customerId && lat != null && lng != null) {
      io.to(String(customerId)).emit('agent:locationUpdate', { lat, lng });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
};

module.exports = registerSocketHandlers;


