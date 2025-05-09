const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getuser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        prn: true,
        userName: true,
        school: {
          select: {
            name: true
          }
        },
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare response with flattened school name
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      prn: user.prn,
      userName: user.userName, // Fixed to match schema
      school: user.school?.name || "N/A",
      imageURL: user.imageURL || "https://github.com/shadcn.png"
    };

    res.status(200).json({ success: true, user: userProfile });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  getuser
};