exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRole = 'user'; // Par défaut, tout nouvel utilisateur est "user"
    
    // Si un admin fait l'inscription et spécifie un rôle valide, on l'accepte
    if (req.user && req.user.role === 'admin' && ['admin', 'collaborateur', 'user'].includes(role)) {
      assignedRole = role;
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
