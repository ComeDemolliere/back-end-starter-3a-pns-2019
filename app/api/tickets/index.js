const { Router } = require('express');
const { Ticket } = require('../../models');
const { Student } = require('../../models');

const router = new Router();

const attachStudent = function (ticket) {
  const student = Student.getById(ticket.studentId);
  const currentTicket = Object.assign({}, ticket);
  currentTicket.student = student;
  return currentTicket;
};

router.get('/:ticketId', (req, res) => res.status(200).json(attachStudent(Ticket.getById(req.params.ticketId))));
router.delete('/:ticketId', (req, res) => res.status(204).json(Ticket.delete(req.params.ticketId)));
router.put('/:ticketId', (req, res) => res.status(200).json(attachStudent(Ticket.update(req.params.ticketId, req.body))));
router.get('/', (req, res) => res.status(200).json(Ticket.get().map(ticket => attachStudent(ticket))));
router.post('/', (req, res) => {
  try {
    const ticket = Ticket.create(req.body);
    res.status(201).json(attachStudent(ticket).copy);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json(err.extra);
    } else {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
