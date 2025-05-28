import mongoose from "mongoose";

const SettingsSChema = new mongoose.Schema({
    key: {type: String, required: true},
    value: {type: mongoose.Schema.Types.Mixed, required: true},
})

const Settings = mongoose.models?.Setting || mongoose.model("Setting", SettingsSChema)

export default Settings