// Poll routes — mirrors the Inshorts poll endpoints.
import { Router } from 'express';
import { store } from '../store.js';

export const poll = Router();

// PUT /:tenant/v2/poll/answer  { pollId, optionId }
poll.put('/:tenant/v2/poll/answer', (req, res) => {
  const { pollId, optionId } = req.body || {};
  const result = store.answerPoll(pollId, optionId);
  if (!result) return res.status(400).json({ error: 'invalid_poll_or_option' });
  res.json(result);
});

// GET /:tenant/v2/poll/:pollId
poll.get('/:tenant/v2/poll/:pollId', (req, res) => {
  const result = store.pollResult(req.params.pollId);
  if (!result) return res.status(404).json({ error: 'not_found' });
  res.json(result);
});
