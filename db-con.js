const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vm99669966",
  database: "hosteldatabase",
});

async function studentLogin(username, password) {
  const query = `SELECT * FROM student WHERE username = ? AND password = ?`;
  const data = await db.promise().query(query, [username, password]);
  return data[0];
}


async function getUserByUsername(username) {
  const query = `SELECT * FROM student WHERE username = ?`;
  const data = await db.promise().query(query, [username]);
  return data[0][0];
}



async function updateUserPassword(username, newPassword) {
  const query = `UPDATE student SET password = ? WHERE username = ?`;
  await db.promise().query(query, [newPassword, username]);
  // Return a success message or handle it as per your requirement
  return { success: true, message: 'Password updated successfully' };
}





async function AdminLogin(username, password) {
  const query = `SELECT * FROM admin WHERE username = ? AND password = ?`;
  const data = await db.promise().query(query, [username, password]);
  return data[0];
}


async function saveComplaint(
  studentid,
  hostel_name,
  mobile_number,
  date,
  room_number,
  block_id,
  problem,
  description,
  
) {
  try {
    const query = `INSERT INTO Complaint (studentid, hostel_name, mobile_number, date, room_number, block_id, problem, description)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(query, [
      studentid,
      hostel_name,
      mobile_number,
      date,
      room_number,
      block_id,
      problem,
      description,
    ]);
    return { success: true, message: "Complaint sent successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Internal server error" };
  }
}


async function fetchComplaintsbyid(studentid){
  const query=`select * from Complaint where studentid= '${studentid}'`;
  const data=await db.promise().query(query);
  return data[0];
}





async function fetchComplaints() {
    const query =  `SELECT * FROM Complaint`;
    const data = await db.promise().query(query);
    return data[0];
}



async function updateComplaintStatus(id, status) {
  
    const query = `UPDATE Complaint SET status = ? WHERE id = ?`;
    const data = await db.promise().query(query, [status, id]);
    return data[0];
  } 

  

module.exports = {
  fetchComplaintsbyid,
  studentLogin,
  AdminLogin,
  updateComplaintStatus,
  fetchComplaints,
  saveComplaint,
  getUserByUsername,
  updateUserPassword
};