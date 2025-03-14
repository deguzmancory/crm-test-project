import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowUpDto } from './create-followup.dto';

export class UpdateFollowUpDto extends PartialType(CreateFollowUpDto) {}
