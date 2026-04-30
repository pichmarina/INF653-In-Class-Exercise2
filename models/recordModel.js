const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const recordsFile = path.join(dataDir, "records.json");

function loadRecords() {
  if (!fs.existsSync(recordsFile)) {
    return [];
  }

  const fileContent = fs.readFileSync(recordsFile, "utf8");

  if (!fileContent.trim()) {
    return [];
  }

  return JSON.parse(fileContent);
}

function saveRecords(records) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2));
}

function getWeekKey(dateString) {
  const date = new Date(dateString);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - firstDay) / 86400000);
  const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

  return `${date.getFullYear()}-W${week}`;
}

function getMonthKey(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function calculateKmPerLiter(record) {
  if (!record.liters || Number(record.liters) === 0) {
    return 0;
  }

  return Number(record.distanceKm) / Number(record.liters);
}

function createRecord(userId, data) {
  const records = loadRecords();

  const record = {
    id: records.length + 1,
    userId: Number(userId),
    date: data.date,
    vehicleType: data.vehicleType,
    liters: Number(data.liters),
    distanceKm: Number(data.distanceKm),
    totalCost: Number(data.totalCost),
  };

  records.push(record);
  saveRecords(records);

  return record;
}

function getRecordsByUser(userId) {
  const records = loadRecords();

  return records
    .filter((record) => record.userId === Number(userId))
    .map((record) => ({
      ...record,
      kmPerLiter: calculateKmPerLiter(record).toFixed(2),
    }));
}

function findRecordById(userId, id) {
  const records = loadRecords();

  return records.find(
    (record) => record.userId === Number(userId) && record.id === Number(id)
  );
}

function updateRecord(userId, id, data) {
  const records = loadRecords();

  const record = records.find(
    (currentRecord) =>
      currentRecord.userId === Number(userId) && currentRecord.id === Number(id)
  );

  if (!record) {
    return null;
  }

  record.date = data.date;
  record.vehicleType = data.vehicleType;
  record.liters = Number(data.liters);
  record.distanceKm = Number(data.distanceKm);
  record.totalCost = Number(data.totalCost);

  saveRecords(records);

  return record;
}

function deleteRecord(userId, id) {
  const records = loadRecords();

  const index = records.findIndex(
    (record) => record.userId === Number(userId) && record.id === Number(id)
  );

  if (index === -1) {
    return false;
  }

  records.splice(index, 1);
  saveRecords(records);

  return true;
}

function getSummaryByUser(userId) {
  const records = loadRecords();
  const userRecords = records.filter((record) => record.userId === Number(userId));

  const weekly = {};
  const monthly = {};

  userRecords.forEach((record) => {
    const weekKey = getWeekKey(record.date);
    const monthKey = getMonthKey(record.date);

    weekly[weekKey] = (weekly[weekKey] || 0) + Number(record.totalCost);
    monthly[monthKey] = (monthly[monthKey] || 0) + Number(record.totalCost);
  });

  return {
    weekly: Object.entries(weekly).map(([period, total]) => ({
      period,
      total: total.toFixed(2),
    })),
    monthly: Object.entries(monthly).map(([period, total]) => ({
      period,
      total: total.toFixed(2),
    })),
  };
}

module.exports = {
  createRecord,
  getRecordsByUser,
  findRecordById,
  updateRecord,
  deleteRecord,
  getSummaryByUser,
};
