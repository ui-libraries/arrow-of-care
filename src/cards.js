export const cards = {
    care: [{
            "text": "Dr. Baby has a high fever.",
            "skill": "H",
            "targets": ["baby"],
            "value": -2
        },
        {
            "text": "Robert has lice and needs his person/possessions cleaned.",
            "skill": "H",
            "targets": ["robert"],
            "value": -2
        }
    ],
    bonus: [{
            "text": "Extra food found.",
            "targets": ["blaise", "robert", "rosario", "baby", "keara", "maya", "tammy", "yusef"],
            "value": 1
        },
        {
            "text": "Medicine found",
            "targets": ["baby", "yusef", "keara"],
            "value": 1
            },
        {
            "text": "Rocket owner's manual discovered.",
            "targets": "rocket",
            "value": 1
        }
    ],
    catastrophe: [{
            "text": "Chemical leaks into water source.",
            "targets": ["blaise", "robert", "rosario", "baby", "keara", "maya", "tammy", "yusef"],
            "value": -2
        },
        {
            "text": "Housing needs to be built.",
            "targets": ["assign"],
            "value": -2
        }
    ],
    start: [
        {
            "text": "Start"
        }
    ],
    crevasse: [
        {
            "text": "Crevasse"
        }
    ]
}