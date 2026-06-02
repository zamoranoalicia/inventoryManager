import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ProductRepository } from '../infrastructure/ProductRepository';
import { Product } from '../domain/models/Product';

const repository = new ProductRepository();

export function useInventory(params: {
  page: number;
  size: number;
  sortField?: string;
  sortOrder?: number;
  filters?: any;
}) {
  const queryClient = useQueryClient();

  // Lazy-loaded products query
  const productsQuery = useQuery({
    queryKey: ['products', params],
    queryFn: () => repository.getAllProducts(params),
    staleTime: 5 * 60 * 1000,  // Cache for 5 minutes
  });

  // Mutations for CRUD
  const createMutation = useMutation({
    mutationFn: (product: Product) => repository.createProduct(product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, product }: { id: string; product: Product }) => repository.updateProduct(id, product),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => repository.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return {
    products: computed(() => productsQuery.data.value?.data || []),
    total: computed(() => productsQuery.data.value?.total || 0),
    isLoading: productsQuery.isLoading,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    refetch: productsQuery.refetch,
  };
}
