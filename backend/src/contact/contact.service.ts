import { Injectable, Logger } from "@nestjs/common";
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { CreateContactDto } from "./dto/create-contact.dto";

export interface StoredMessage extends CreateContactDto { id: string; receivedAt: string }

const DIR = join(process.cwd(), "storage");
const FILE = join(DIR, "messages.jsonl");

/** Saves each message as one JSON line in storage/messages.jsonl (gitignored). Swap for a DB or mailer later. */
@Injectable()
export class ContactService {
  private readonly log = new Logger(ContactService.name);

  async create(dto: CreateContactDto): Promise<StoredMessage> {
    const stored: StoredMessage = { id: crypto.randomUUID(), receivedAt: new Date().toISOString(), ...dto };
    await mkdir(DIR, { recursive: true });
    await appendFile(FILE, JSON.stringify(stored) + "\n", "utf8");
    this.log.log(`New message ${stored.id} from ${dto.email}`);
    return stored;
  }
}
