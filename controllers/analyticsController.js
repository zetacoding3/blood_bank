const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
//GET BLOOD DATA
const bloodGroupDetailsContoller = async (req, res) => {
  try {
    const bloodGroups = ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"];
    const bloodGroupData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //get single blood group
    await Promise.all(
      bloodGroups.map(async (bloodGroup) => {
        //COunt TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //COunt TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //CALCULATE TOTAL
        const availabeBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        //PUSH DATA
        bloodGroupData.push({
          bloodGroup,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availabeBlood,
        });
      })
    );

    return res.status(200).send({
      success: true,
      message: "Blood Group Data Fetch Successfully",
      bloodGroupData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Bloodgroup Data Analytics API",
      error,
    });
  }
};

const getStatsController = async (req, res) => {
  try {
    const organisation = new mongoose.Types.ObjectId(req.body.userId);

    // Get total blood donations (IN)
    const totalIn = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "in"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // Get total blood used (OUT)
    const totalOut = await inventoryModel.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "out"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // Get total unique donors
    const totalDonors = await inventoryModel.distinct("donar", {
      organisation,
      inventoryType: "in"
    });

    // Get total unique hospitals
    const totalHospitals = await inventoryModel.distinct("hospital", {
      organisation,
      inventoryType: "out"
    });

    // Get recent transactions
    const recentTransactions = await inventoryModel
      .find({ organisation })
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate total available blood
    const totalAvailable = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

    return res.status(200).send({
      success: true,
      message: "Stats fetched successfully",
      data: {
        totalDonations: totalIn[0]?.total || 0,
        totalUsed: totalOut[0]?.total || 0,
        totalAvailable,
        totalDonors: totalDonors.length,
        totalHospitals: totalHospitals.length,
        recentTransactions
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in stats API",
      error
    });
  }
};

module.exports = { bloodGroupDetailsContoller, getStatsController };
