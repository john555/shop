import { gql } from '@apollo/client';
import { UserPasswordUpdateInput, UserUpdateInput } from '../types';
import { client } from '../apollo';

const UPDATE_USER = gql`
  mutation updateUser($input: UserUpdateInput!) {
    updateUser(input: $input) {
      id
      email
      firstName
      lastName
      imageUrl
      language
      timeZone
      theme
      updatedAt
      stores {
        id
      }
    }
  }
`;

const UPDATE_USER_PASSWORD = gql`
  mutation updatePassword($input: UserPasswordUpdateInput!) {
    updatePassword(input: $input) {
      id
      email
      firstName
      lastName
      imageUrl
      language
      timeZone
      theme
      updatedAt
      stores {
        id
      }
    }
  }
`;

export const updateUser = async (input: UserUpdateInput) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_USER,
      variables: { input },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.updateUser;
  } catch (err) {
    throw err instanceof Error ? err : new Error('An error occurred');
  } finally {
  }
};

export const updateUserPassword = async (input: UserPasswordUpdateInput) => {
  try {
    const { data, errors } = await client.mutate({
      mutation: UPDATE_USER_PASSWORD,
      variables: { input },
    });

    if (errors) {
      throw new Error(errors[0].message);
    }

    return data.updatePassword;
  } catch (err) {
    throw err instanceof Error ? err : new Error('An error occurred');
  } finally {
  }
};

