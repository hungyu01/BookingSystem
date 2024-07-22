const { Space, TimeSlot, Booking } = require('./models');

// 獲取所有空間
app.get('/api/spaces', async (req, res) => {
    const spaces = await Space.find();
    res.json(spaces);
});

// 獲取所有時間段
app.get('/api/timeslots', async (req, res) => {
    const timeSlots = await TimeSlot.find();
    res.json(timeSlots);
});

// 創建新預約
app.post('/api/bookings', async (req, res) => {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
});

// 添加新空間
app.post('/api/spaces', async (req, res) => {
    const space = new Space(req.body);
    await space.save();
    res.json(space);
});

// 添加新時間段
app.post('/api/timeslots', async (req, res) => {
    const timeSlot = new TimeSlot(req.body);
    await timeSlot.save();
    res.json(timeSlot);
});

// 刪除空間
app.delete('/api/spaces/:id', async (req, res) => {
    await Space.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});

// 刪除時間段
app.delete('/api/timeslots/:id', async (req, res) => {
    await TimeSlot.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
});