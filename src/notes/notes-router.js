const express = require("express");
const NotesService = require("./notes-service");
const helpers = require("../helpers");
const path = require("path");
const CampaignsService = require("../campaigns/campaigns-service");
const { requireAuth } = require("../middleware/jwt-auth");
const xss = require("xss");

const userNotesRouter = express.Router();
const notesRouter = express.Router();
const jsonParser = express.json();

function sanitizeNote(note) {
  note = {
    ...note,
    note_title: xss(note.note_title),
    note_content: xss(note.note_content),
  };

  return note;
}

//userNotesRouter is protected endpoint that gets notes based on user's permission to access

userNotesRouter
  .route("/:campaign_id")
  .all(requireAuth)
  .all(async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;
    try {
      //check  that campaign exists and store campaign notes
      const campaign = await CampaignsService.getCampaignById(db, campId);

      if (!campaign) {
        return res.status(404).json({
          error: `Campaign Not Found`,
        });
      }

      const notes = await NotesService.getAllNotesByCampaign(db, campId);
      req.notes = notes;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    try {
      //sanitize notes with xss and send
      const notes = req.notes.map((note) => sanitizeNote(note));
      res.json(notes);
      next();
    } catch (error) {
      next(error);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    const db = req.app.get("db");
    const campaign = req.params.campaign_id;
    const admin = req.user.id;

    try {
      //converge note elements into a note
      const { note_title, note_content, private_note = false } = req.body;
      const newNote = {
        admin,
        note_title,
        note_content,
        private_note,
        campaign,
      };

      //error validation

      let error = "";

      error = helpers.validateKeys(newNote, [
        "admin",
        "note_title",
        "note_content",
      ]);
      if (error) {
        return res.status(400).json(error);
      }

      error = helpers.validateType(admin, "number", "admin");
      if (error) {
        return res.status(400).json(error);
      }
      error = helpers.validateType(note_title, "string", "note_title");
      if (error) {
        return res.status(400).json(error);
      }
      error = helpers.validateMinStringLength(note_title, 4, "note_title");
      if (error) {
        return res.status(400).json(error);
      }
      error = helpers.validateType(note_content, "string", "note_content");
      if (error) {
        return res.status(400).json(error);
      }

      if (private_note) {
        error = helpers.validateType(private_note, "boolean", "private_note");
        if (error) {
          return res.status(400).json(error);
        }
      }

      //sanitize and post note

      const note = await NotesService.addNote(db, newNote);

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.id}`))
        .json(sanitizeNote(note));

      next();
    } catch (error) {
      next(error);
    }
  });

userNotesRouter
  .route("/:campaign_id/:note_id")
  .all(requireAuth)
  .all(async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;
    const noteId = req.params.note_id;

    try {
      //check that campaign exists and store note
      campaign = await CampaignsService.getCampaignById(db, campId);

      if (!campaign) {
        return res.status(404).json({
          error: `Campaign Not Found`,
        });
      }

      const note = await NotesService.getNoteById(db, campId, noteId);

      if (!note) {
        return res.status(404).json({
          error: `Note Not Found`,
        });
      }

      req.note = note;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    try {
      //sanitize and send note
      res.json(sanitizeNote(req.note));
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;
    const noteId = req.params.note_id;

    try {
      await NotesService.deleteNote(db, campId, noteId);

      res.status(204).end();

      next();
    } catch (error) {
      next(error);
    }
  })
  .patch(jsonParser, async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;
    const noteId = req.params.note_id;

    try {
      //updated note key validation
      const { note_title, note_content, private_note } = req.body;

      const updateNoteFields = {
        note_title,
        note_content,
        private_note,
      };

      const numOfValues = Object.values(updateNoteFields).filter(Boolean)
        .length;
      if (numOfValues === 0) {
        return res
          .status(400)
          .json({
            error: {
              message: `Invalid Request: body must include a field to update`,
            },
          });
      }

      let error = "";

      if (note_title) {
        error = helpers.validateType(note_title, "string", "note_title");
        if (error) {
          return res.status(400).json(error);
        }
        error = helpers.validateMinStringLength(note_title, 3, "note_title");
        if (error) {
          return res.status(400).json(error);
        }
      }

      if (note_content) {
        error = helpers.validateType(note_content, "string", "note_content");
        if (error) {
          return res.status(400).json(error);
        }
      }

      if (private_note) {
        error = helpers.validateType(private_note, "boolean", "private_note");
        if (error) {
          return res.status(400).json(error);
        }
      }

      await NotesService.updateNote(db, campId, noteId, updateNoteFields);

      res.status(204).end();

      next();
    } catch (error) {
      next(error);
    }
  });

//notesRouter is not protected and gets all notes set to public in a public campaign
notesRouter
  .route("/:campaign_id")
  .all(async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;

    try {
      //check that campaign exists and store notes
      const campaign = await CampaignsService.getCampaignById(db, campId);

      if (!campaign) {
        return res.status(404).json({
          error: `Campaign Not Found`,
        });
      }

      const notes = await NotesService.getAllNotesByCampaign(db, campId);

      req.notes = notes;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    try {
      //sanitize and send notes
      const notes = req.notes.map((note) => sanitizeNote(note));
      res.json(notes);
      next();
    } catch (error) {
      next(error);
    }
  });

notesRouter
  .route("/:campaign_id/:note_id")
  .all(async (req, res, next) => {
    const db = req.app.get("db");
    const campId = req.params.campaign_id;
    const noteId = req.params.note_id;

    try {
      //check that campaign and note exist and store note
      const campaign = await CampaignsService.getCampaignById(db, campId);

      if (!campaign) {
        return res.status(404).json({
          error: `Campaign Not Found`,
        });
      }

      const note = await NotesService.getNoteById(db, campId, noteId);

      if (!note) {
        return res.status(404).json({
          error: `Note Not Found`,
        });
      }

      req.note = note;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get((req, res, next) => {
    try {
      //sanitize and send note
      res.json(sanitizeNote(req.note));
    } catch (error) {
      next(error);
    }
  });

module.exports = {
  userNotesRouter,
  notesRouter,
};
