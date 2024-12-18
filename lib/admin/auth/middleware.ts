// lib/auth/middleware.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { gql } from '@apollo/client';
import { client } from '@/lib/common/apollo';

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
      email
    }
  }
`;

const CHECK_STORE_ACCESS_QUERY = gql`
  query CheckStoreAccess($id: String!) {
    store(id: $id) {
      id
      ownerId
    }
  }
`;

export async function authenticateRequest(request: NextRequest) {
  try {
    // Get current user using Apollo client
    const { data, errors } = await client.query({
      query: CURRENT_USER_QUERY,
      context: {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      },
    });

    if (errors || !data?.me) {
      return {
        success: false,
        error: 'Invalid or expired session',
        status: 401
      };
    }

    return {
      success: true,
      user: data.me
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: 'Authentication failed',
      status: 401
    };
  }
}

export async function verifyStoreAccess(userId: string, storeId: string) {
  try {
    const { data } = await client.query({
      query: CHECK_STORE_ACCESS_QUERY,
      variables: { id: storeId },
    });

    return data?.store?.ownerId === userId;
  } catch (error) {
    console.error('Store access verification error:', error);
    return false;
  }
}