import {
    User,
    FriendsList,
    Soundscape,
    SoundscapeSound,
    Sound,
    MySound,
    UserSoundscape
} from '../../database/model.js';
import multer from 'multer';
import path from 'path';

async function getFriends(req, res) {
    if (req.session.user) {
        const id = req.session.user.userId;
        const myFriends = await User.findAll({
            where: {
                userId: id
            },
            include: {
                model: User,
                as: 'friend'
            }
        });
        res.status(200).json({
            myFriends: myFriends[0].friend
        });
    } else {
        res.status(401).json({success: false});
    };
};

//Fetch the Logged In User details
const getUsers = async (req,res) => {
    if(req.session.user){
        let users = await User.findOne(
            {where:{
                userId: req.session.user.userId
            }}
        );
        res.json(users);
    } else{
        res.json({error: 'not logged in'});
    };
};

// Fetch sound data
const getSounds = async (req, res) => {
    const user = req.session.user;
    let favs;
    if (user) {
        favs = await Soundscape.findAll({
            include: {
                model: Sound
            },
            where: {
                userId: user.userId
            }
        });
    };

    const sounds = [
        {
            type: "Ambient",
            sounds: await Sound.findAll({
                where: {
                    type: "Ambient"
                }
            })
        },
        {
            type: "Environment",
            sounds: await Sound.findAll({
                where: {
                    type: "Environment"
                }
            })
        },
        {
            type: "Music",
            sounds: await Sound.findAll({
                where: {
                    type: "Music"
                }
            })
        }
    ];
    console.log(favs)
    res.status(200).json({
        success: true,
        sounds: sounds,
        favs: favs
    });
};

// This is how soundscape data should come in to be saved as a favorite soundscape:
// let selectedSounds = {
//     name: 'my favorite soundscape',
//     isPrivate: false,
//     userId: 1,
//     sounds: {
//         sound1: {
//             sound: {
//                 soundId: 1,
//                 sound: 'file-path',
//                 name: 'name',
//             },
//             fx: {
//                 volume: 100
//             }
//         },
//         sound2: {
//             sound: {},
//             fx: {}
//         },
//         sound3: {
//             sound: {},
//             fx: {}
//         },
//         sound4: {
//             sound: {},
//             fx: {}
//         },
//     }
// }

// Post favorite sounds
const postFavSounds = async(req, res) => {
    console.log(req.body, "<----------- this is req.body");
    const { name, isPrivate, selectedSounds: { sound1, sound2, sound3, sound4 } } = req.body;
    if (req.session.user) {
        const user = req.session.user
        const newSoundscape = await Soundscape.create({
            userId: user.userId,
            name: name,
            isPrivate: isPrivate
        });
        
        const soundSave = async(sound) => {
            if (sound) {
                await SoundscapeSound.create({
                    soundscapeId: newSoundscape.soundscapeId,
                    soundId: sound.sound.soundId,
                    volume: sound.fx.volume
                });
            } else {
                return;
            };
        };
        if (sound1.sound) {
            soundSave(sound1);
        };
        if (sound2.sound) {
            soundSave(sound2);
        };
        if (sound3.sound) {
            soundSave(sound3);
        };
        if (sound4.sound) {
            soundSave(sound4);
        };
        res.status(200).json({success: true});
    } else {
        res.status(401).json({error: 'Must be logged in to save a soundscape.'});
    };
};

const deleteFav = async(req, res) => {

}

const deleteSoundscape = async(req, res) => {
    console.log(req)
    const { soundscapeId } = req.params.id;
    await Soundscape.destroy({
        where: {
            soundscapeId: soundscapeId
        }
    });
    res.status(200).json({success: true});
};

//Upload Audio
const addAudio = async (req,res) => {

    const sound = {
        sound: req.file.path,
        type: req.body.type
    }
    const audio = await MySound.create(sound)
    res.status(200). send(audio)
    console.log(audio)

}

//Audio Controller
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb (null, 'public/audio');
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize: '5000000'},
    fileFilter: (req, file, cb) =>{
        const fileType = /mp3|wav|aac|ogg|flac|/
        const mimetype =fileType.test(file.mimetype)
        const extname = fileType.test(path.extname(file.originalname))

        if(mimetype && extname){
            return cb(null,true)
        }
        cb ('Provide the proper file format to upload. MP3, WAV, AACC, OGG, and FLAC are supported.')
    }
    }).array('sound', 3);

export {
    getFriends,
    getUsers,
    upload,
    addAudio,
    getSounds,
    postFavSounds,
    deleteFav,
    deleteSoundscape
};