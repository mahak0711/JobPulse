// app/api/applications/route.js

import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET all job applications with optional filters and sorting
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jobpulse');
    const collection = db.collection('applications');

    // Get query parameters
    const { searchParams } = new URL(request.url);

    const filter = {};
    const sort = {};

    // Filter by status (e.g., ?status=Interview)
    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }

    // Filter by company (e.g., ?company=Google)
    if (searchParams.has('company')) {
      filter.company = { $regex: new RegExp(searchParams.get('company'), 'i') };
    }

    // Filter by position (e.g., ?position=Frontend)
    if (searchParams.has('position')) {
      filter.position = { $regex: new RegExp(searchParams.get('position'), 'i') };
    }

    // Sort by dateApplied or company, etc.
    const sortField = searchParams.get('sortBy') || 'dateApplied';
    const sortOrder = searchParams.get('order') === 'asc' ? 1 : -1;
    sort[sortField] = sortOrder;

    const applications = await collection.find(filter).sort(sort).toArray();

    return NextResponse.json(applications);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
