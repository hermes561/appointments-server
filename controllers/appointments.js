var Model = require('../models/index');
var moment = require("moment");
const { Appointment, Slot } = Model;
const Nexmo = require("nexmo");

const appointmentController = {
  all(req, res) {
    // Returns all appointments
    Appointment.find({}).exec((err, appointments) => res.json(appointments));
  },
  create(req, res) {
    var requestBody = req.body;
    console.log(req.body);
    
    var newslot = new Slot({
      slot_time: requestBody.slot_time,
      slot_date: requestBody.slot_date,
      created_at: Date.now()
    });
    
    //console.log(newslot);
    newslot.save();
    // Creates a new record from a submitted form
    var newappointment = new Appointment({
      name: requestBody.name,
      email: requestBody.email,
      phone: requestBody.phone,
      slots: newslot._id
    });
   // console.log(newappointment);
    const nexmo = new Nexmo({
      apiKey: "7234f8a1",
      apiSecret: "qb8DCxsDxs85IrxM"
    });
    
    const time1 = moment()
        .hour(9)
        .minute(0)
        .add(requestBody.slot_time, "hours");
    const time2 = moment()
        .hour(9)
        .minute(0)
        .add(requestBody.slot_time + 1, "hours");
    let msg =
      requestBody.name +
      " " +
      "this message is to confirm your appointment at" +
      " our Company, between " +
      time1.format("hh:mm") + " - " + time2.format("hh:mm");

    // and saves the record to
    // the data base
    newappointment.save((err, saved) => {
      // Returns the saved appointment
      // after a successful save
      Appointment.find({ _id: saved._id })
        .populate("slots")
        .exec((err, appointment) => res.json(appointment));

      const from = 'Nexmo test';
      //const to = requestBody.phone;
      const to = '40724999340';

//      nexmo.message.sendSms(from, to, msg, (err, responseData) => {
//        if (err) {
//          console.log(err);
//        } else {
//          console.dir(responseData);
//        }
//      });
    });
  }
};

module.exports = appointmentController;