import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    const client = await clientPromise;
    const db = client.db('jobpulse');
    const jobs = db.collection('jobs');

    const result = await jobs.insertOne({
      ...data,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, jobId: result.insertedId });
  } catch (error) {
    console.error('Error adding job:', error);
    return NextResponse.json({ error: 'Failed to add job' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jobpulse');
    const jobs = db.collection('jobs');

    const jobList = await jobs.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(jobList);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
