const express = require('express');
const db = require('./db-con');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Login API for student
app.post('/student-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await db.studentLogin(username, password);
    if (data.length === 0) { // If user not found
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login API for admins
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const data = await db.AdminLogin(username, password);
    if (data.length === 0) { // If user not found
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//saveComplaint API
app.post('/complaintform', async (req, res) => {
  try {
    const { 
      studentid,
      hostel_name,
      mobile_number,
      date,
      room_number,
      block_id,
      problem,
      description,
    } = req.body;

    // Pass the username to the saveComplaint function
    const data = await db.saveComplaint(
      studentid,
      hostel_name,
      mobile_number,
      date,
      room_number,
      block_id,
      problem,
      description,
      
    );
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


//getbyid
app.get("/complaints/:studentid", async (req, res)=>{
  try{console.log("postproperty get api called");
  let data= await db.fetchComplaintsbyid(req.params.studentid);
  res.write(JSON.stringify(data));
res.end();
  }catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  

});


// // Fetch Complaints API
app.get('/complaints', async (req, res) => {
  try {
    
    const complaints = await db.fetchComplaints();
    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Update Complaint Status API
app.patch('/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.updateComplaintStatus(id, status); // Use updateComplaintStatus function
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






app.put('/users/:username/password', async (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: 'New password and confirmation do not match' });
  }

  try {
    const user = await db.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    await db.updateUserPassword(username, newPassword);

    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});


