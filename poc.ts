import * as fs from "fs";
import * as readline from "readline";

const DATA_FILE = "appointments.json";

interface Appointment {
  id: number;
  playerName: string;
  tournament: string;
  appointmentDate: string;
  createdAt: string;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function loadAppointments(): Appointment[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }

    const data = fs.readFileSync(DATA_FILE, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load appointments:", error);
    return [];
  }
}

function saveAppointments(appointments: Appointment[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2), "utf8");
}

async function bookAppointment(): Promise<void> {
  console.log("\n=== Book Tournament Appointment ===");

  const playerName = await ask("Player name: ");
  const tournament = await ask("Tournament name: ");
  const appointmentDate = await ask("Appointment date (YYYY-MM-DD): ");

  const appointments = loadAppointments();

  const appointment: Appointment = {
    id: Date.now(),
    playerName,
    tournament,
    appointmentDate,
    createdAt: new Date().toISOString(),
  };

  appointments.push(appointment);
  saveAppointments(appointments);

  console.log("\nAppointment booked successfully.");
}

function listAppointments(): void {
  const appointments = loadAppointments();

  console.log("\n=== Appointments ===");

  if (appointments.length === 0) {
    console.log("No appointments found.");
    return;
  }

  appointments.forEach((a) => {
    console.log(`
ID: ${a.id}
Player: ${a.playerName}
Tournament: ${a.tournament}
Date: ${a.appointmentDate}
Created: ${a.createdAt}
-----------------------------------
`);
  });
}

async function mainMenu(): Promise<void> {
  while (true) {
    console.log(`
=================================
 Tournament Appointment System
=================================
1. Book Appointment
2. View Appointments
3. Exit
`);

    const choice = await ask("Select option: ");

    switch (choice) {
      case "1":
        await bookAppointment();
        break;

      case "2":
        listAppointments();
        break;

      case "3":
        console.log("Goodbye!");
        rl.close();
        process.exit(0);

      default:
        console.log("Invalid option.");
    }
  }
}

mainMenu().catch((err) => {
  console.error(err);
  rl.close();
});
