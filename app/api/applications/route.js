import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('jobpulse');
    const collection = db.collection('applications');

    const { searchParams } = new URL(request.url);

    const filter = { userEmail: session.user.email }; // Restrict to current user
    const sort = {};

    if (searchParams.has('status')) {
      filter.status = searchParams.get('status');
    }

    if (searchParams.has('company')) {
      filter.company = { $regex: new RegExp(searchParams.get('company'), 'i') };
    }

    if (searchParams.has('position')) {
      filter.position = { $regex: new RegExp(searchParams.get('position'), 'i') };
    }

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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const client = await clientPromise;
    const db = client.db('jobpulse');
    const collection = db.collection('applications');

    const result = await collection.insertOne({
      ...data,
      userEmail: session.user.email, // 🧠 store user identity
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, jobId: result.insertedId });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to add application' }, { status: 500 });
  }
}
