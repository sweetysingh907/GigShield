const { validationResult } = require('express-validator');
const Trigger = require('../models/Trigger');

// @GET /api/triggers
exports.getTriggers = async (req, res, next) => {
  try {
    const triggers = await Trigger.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: triggers.length, data: triggers });
  } catch (error) { next(error); }
};

// @POST /api/triggers
exports.createTrigger = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const { name, type, threshold, payoutAmount, platform } = req.body;
    const trigger = await Trigger.create({ user: req.user.id, name, type, threshold, payoutAmount: parseFloat(payoutAmount), platform: platform || 'All', status: 'standby' });
    res.status(201).json({ success: true, data: trigger });
  } catch (error) { next(error); }
};

// @PUT /api/triggers/:id
exports.updateTrigger = async (req, res, next) => {
  try {
    const trigger = await Trigger.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true, runValidators: true });
    if (!trigger) return res.status(404).json({ success: false, message: 'Trigger not found' });
    res.json({ success: true, data: trigger });
  } catch (error) { next(error); }
};

// @PATCH /api/triggers/:id/toggle
exports.toggleTrigger = async (req, res, next) => {
  try {
    const trigger = await Trigger.findOne({ _id: req.params.id, user: req.user.id });
    if (!trigger) return res.status(404).json({ success: false, message: 'Trigger not found' });
    trigger.isActive = !trigger.isActive;
    trigger.status = trigger.isActive ? 'armed' : 'standby';
    await trigger.save();
    res.json({ success: true, data: trigger, message: `Trigger ${trigger.isActive ? 'enabled' : 'disabled'}` });
  } catch (error) { next(error); }
};

// @DELETE /api/triggers/:id
exports.deleteTrigger = async (req, res, next) => {
  try {
    const trigger = await Trigger.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!trigger) return res.status(404).json({ success: false, message: 'Trigger not found' });
    res.json({ success: true, message: 'Trigger deleted successfully' });
  } catch (error) { next(error); }
};