import { gql, useMutation, useQuery } from '@apollo/client';
import {
  AddressOnOwnerCreateInput,
  AddressOnOwnerUpdateInput,
  AddressOnOwner,
} from '@/types/admin-api';

const ADDRESS_OWNER_FIELDS = `
  id
  ownerType
  ownerId
  type
  isDefault
  address {
    id
    country
    state
    city
    line1
    line2
    zipCode
  }
`;

const GET_ADDRESS_OWNER = gql`
  query GetAddressOwner($id: ID!) {
    addressOnOwner(id: $id) {
      ${ADDRESS_OWNER_FIELDS}
    }
  }
`;

const CREATE_ADDRESS_OWNER = gql`
  mutation CreateAddressOwner($input: AddressOnOwnerCreateInput!) {
    createAddressOnOwner(input: $input) {
      ${ADDRESS_OWNER_FIELDS}
    }
  }
`;

const UPDATE_ADDRESS_OWNER = gql`
  mutation UpdateAddressOwner($input: AddressOnOwnerUpdateInput!) {
    updateAddressOnOwner(input: $input) {
      ${ADDRESS_OWNER_FIELDS}
    }
  }
`;

const DELETE_ADDRESS_OWNER = gql`
  mutation DeleteAddressOwner($id: ID!) {
    deleteAddressOnOwner(id: $id)
  }
`;

export function useAddressOwner(id?: string) {
  const {
    data: addressOwnerData,
    loading: loadingAddressOwner,
    error: addressOwnerError,
  } = useQuery(GET_ADDRESS_OWNER, {
    variables: { id },
    skip: !id,
  });

  const [createAddressOwner, { loading: creating }] =
    useMutation(CREATE_ADDRESS_OWNER);
  const [updateAddressOwner, { loading: updating }] =
    useMutation(UPDATE_ADDRESS_OWNER);
  const [deleteAddressOwner, { loading: deleting }] =
    useMutation(DELETE_ADDRESS_OWNER);

  const loading = loadingAddressOwner;
  const error = addressOwnerError;

  return {
    addressOnOwner: addressOwnerData?.addressOnOwner as AddressOnOwner | null,
    loading,
    creating,
    updating,
    deleting,
    error,
    createAddressOwner: async (input: AddressOnOwnerCreateInput) => {
      const response = await createAddressOwner({ variables: { input } });
      return response.data.createAddressOwner;
    },
    updateAddressOwner: async (input: AddressOnOwnerUpdateInput) => {
      const response = await updateAddressOwner({ variables: { input } });
      return response.data.updateAddressOwner;
    },
    deleteAddressOwner: async (addressOwnerId: string) => {
      const response = await deleteAddressOwner({
        variables: { id: addressOwnerId },
      });
      return response.data.deleteAddressOwner;
    },
  };
}
