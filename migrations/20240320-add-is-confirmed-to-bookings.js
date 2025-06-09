module.exports = {
  async up(db) {
    // Add isConfirmed field to all existing bookings
    await db.collection('bookings').updateMany(
      { isConfirmed: { $exists: false } },
      { $set: { isConfirmed: false } }
    );
  },

  async down(db) {
    // Remove isConfirmed field from all bookings
    await db.collection('bookings').updateMany(
      { isConfirmed: { $exists: true } },
      { $unset: { isConfirmed: "" } }
    );
  }
}; 