const recordModel = require("../models/recordModel");

function index(req, res) {
  const records = recordModel.getRecordsByUser(req.session.userId);
  const summary = recordModel.getSummaryByUser(req.session.userId);

  res.render("records/dashboard", {
    records,
    summary,
    csrfToken: req.csrfToken ? req.csrfToken() : null,
  });
}

function showAddForm(req, res) {
  res.render("records/add", {
    csrfToken: req.csrfToken(),
  });
}

function create(req, res) {
  recordModel.createRecord(req.session.userId, req.body);
  res.redirect("/records");
}

function showEditForm(req, res) {
  const record = recordModel.findRecordById(req.session.userId, req.params.id);

  if (!record) {
    return res.status(404).send("Record not found");
  }

  res.render("records/edit", {
    record,
    csrfToken: req.csrfToken(),
  });
}

function update(req, res) {
  const record = recordModel.updateRecord(req.session.userId, req.params.id, req.body);

  if (!record) {
    return res.status(404).send("Record not found");
  }

  res.redirect("/records");
}

function remove(req, res) {
  recordModel.deleteRecord(req.session.userId, req.params.id);
  res.redirect("/records");
}

module.exports = {
  index,
  showAddForm,
  create,
  showEditForm,
  update,
  remove,
};