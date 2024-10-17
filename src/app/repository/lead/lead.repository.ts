import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { AbstractLeadRepository } from 'src/app/interface/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@Injectable()
export class LeadRepository implements AbstractLeadRepository {
  constructor(
    @InjectModel(Lead.name)
    private leadModel: Model<Lead & Document>,

    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
  ) {}

  async getAllLeads(): Promise<Lead[] | null> {
    return await this.leadModel.find({});
  }

  async getLeadById(id: string): Promise<Lead | null> {
    return await this.leadModel.findById(id);
  }

  async createLead(createLeadDto: CreateLeadDTO): Promise<Lead | null> {
    const { stage_id, ...leadData } = createLeadDto;

    // Create a new lead
    const lead = await this.leadModel.create(leadData);

    if (!lead) {
      throw new Error('Opportunity creation failed');
    }

    // Update the opportunity by pushing the new lead's _id into the leads array
    const updatedOpportunity = await this.opportunityModel.findByIdAndUpdate(
      stage_id,
      { $push: { leads: lead._id } },
      { new: true }, // Return the updated document
    );

    if (!updatedOpportunity) {
      throw new Error(`Stage with id ${stage_id} not found`);
    }

    return lead;
  }

  async updateLead(
    id: string,
    updateLeadDto: CreateLeadDTO,
  ): Promise<Lead | null> {
    return await this.leadModel.findByIdAndUpdate(id, updateLeadDto, {
      new: true,
    });
  }

  async deleteLead(id: string): Promise<any> {
    return await this.leadModel.findByIdAndDelete(id);
  }
}
