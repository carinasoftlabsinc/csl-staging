const Team = require('../../model/tmgsModels/team.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../handlerFactory');

exports.createTeamMember = catchAsync(async (req, res, next) => {
    const { name, designation, image } = req.body;

    if (!image) {
        return next(new AppError('Image is required!', 400));
    }

    const newMember = await Team.create({ name, designation, image });

    res.status(201).json({
        status: 'success',
        data: { member: newMember }
    });
});


exports.getAllTeamMembers = catchAsync(async (req, res, next) => {
    const members = await Team.find();

    res.status(200).json({
        status: 'success',
        results: members.length,
        data: { members }
    });
});


exports.getTeamMember = catchAsync(async (req, res, next) => {
    const member = await Team.findById(req.params.id);

    if (!member) {
        return next(new AppError('No team member found with this ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { member }
    });
});

exports.updateTeamMember = catchAsync(async (req, res, next) => {
    const updatedMember = await Team.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedMember) {
        return next(new AppError('No team member found with this ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { member: updatedMember }
    });
});

exports.deleteTeamMember = catchAsync(async (req, res, next) => {
    const member = await Team.findByIdAndDelete(req.params.id);

    if (!member) {
        return next(new AppError('No team member found with this ID', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Team member deleted successfully',
        data: { member }
    });
});



exports.getPaginatedTeam = helper.pagination(Team, 'name');