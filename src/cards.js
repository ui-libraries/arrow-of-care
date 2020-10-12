export const cards = {
    care: [{
            "text": "Dr. Baby has a high fever.",
            "skill": "H",
            "targets": ["baby"],
            "value": -2,
            "type": "care"
        },
        {
            "text": "Robert has lice and needs his person/possessions cleaned.",
            "skill": "H",
            "targets": ["robert"],
            "value": -2,
            "type": "care"
        }
    ],
    bonus: [{
            "text": "Extra food found.",
            "targets": ["blaise", "robert", "rosario", "baby", "keara", "maya", "tammy", "yusef"],
            "value": 1,
            "type": "bonus"
        },
        {
            "text": "Medicine found",
            "targets": ["baby", "yusef", "keara"],
            "value": 1,
            "type": "bonus"
            },
        {
            "text": "Rocket owner's manual discovered.",
            "targets": "rocket",
            "value": 1,
            "type": "bonus"
        }
    ],
    catastrophe: [{
            "text": "Chemical leaks into water source.",
            "targets": ["blaise", "robert", "rosario", "baby", "keara", "maya", "tammy", "yusef"],
            "value": -2,
            "type": "catastrophe"
        },
        {
            "text": "Housing needs to be built.",
            "targets": ["assign"],
            "value": -2,
            "type": "catastrophe"
        }
    ],
    start: [
        {
            "text": "Start",
            "type": "start"
        }
    ],
    crevasse: [
        {
            "text": "Crevasse",
            "type": "crevasse"
        }
    ]
}