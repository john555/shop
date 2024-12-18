'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  X,
  ImageIcon,
  Film,
  CuboidIcon as Cube,
  Search,
  SortAsc,
  LayoutGrid,
  ChevronDown,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMedia } from '@/lib/admin/hooks/media';
import {
  Media,
  MediaOwnerType,
  MediaPurpose,
  MediaType,
} from '@/lib/common/types/api';

type MediaInputProps = {
  ownerType: MediaOwnerType;
  ownerId: string;
  storeId: string;
};

export default function MediaInput(props: MediaInputProps) {
  const { media, uploadMedia } = useMedia({
    filters: {
      storeId: props.storeId,
    },
  });
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    fileType: '',
    fileSize: '',
    usedIn: '',
    productId: '',
  });
  const [isAddFromUrlOpen, setIsAddFromUrlOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
    // const newMedia = acceptedFiles.map((file) => ({
    //   id: Math.random().toString(36).substr(2, 9),
    //   type: file.type.startsWith('image/')
    //     ? 'image'
    //     : file.type.startsWith('video/')
    //     ? 'video'
    //     : ('3d' as 'image' | 'video' | '3d'),
    //   url: URL.createObjectURL(file),
    //   thumbnailUrl: file.type.startsWith('image/')
    //     ? URL.createObjectURL(file)
    //     : '/placeholder.svg?height=100&width=100',
    //   name: file.name.split('.')[0],
    //   fileType: file.name.split('.').pop()?.toUpperCase() || '',
    //   fileSize: file.size,
    //   usedIn: [],
    //   product: '',
    // }));
    uploadMedia({
      file: acceptedFiles[0],
      ownerType: props.ownerType,
      ownerId: props.ownerId,
      storeId: props.storeId,
      purpose: MediaPurpose.Gallery,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  // const filteredAndSortedMedia = useMemo(() => {
  //   return media;
  //   return media
  //     .filter(
  //       (item) =>
  //         item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) &&
  //         (filters.fileType ? item.type === filters.fileType : true) &&
  //         (filters.fileSize
  //           ? filters.fileSize === 'small'
  //             ? item.fileSize < 1000000
  //             : filters.fileSize === 'medium'
  //             ? item.fileSize >= 1000000 && item.fileSize < 5000000
  //             : item.fileSize >= 5000000
  //           : true) &&
  //         (filters.usedIn ? item.usedIn.includes(filters.usedIn) : true) &&
  //         (filters.productId ? item.product.id === filters.productId : true)
  //     )
  //     .sort((a, b) => {
  //       if (sortBy === 'name') return a.fileName.localeCompare(b.fileName);
  //       if (sortBy === 'size') return a.fileSize - b.fileSize;
  //       return 0; // For 'date', we would need to add a date field to our MediaItem type
  //     });
  // }, [media, searchQuery, sortBy, filters]);

  const filteredAndSortedMedia = media;

  const handleAddFromUrl = () => {};

  const handleDone = () => {
    const newSelectedMedia = media.filter((item) => selectedFiles.has(item.id));
    setSelectedMedia((prevSelected) => [...prevSelected, ...newSelectedMedia]);
    setSelectedFiles(new Set());
    setIsDialogOpen(false);
  };

  const moveMedia = (dragIndex: number, hoverIndex: number) => {
    const dragItem = selectedMedia[dragIndex];
    const newMedia = [...selectedMedia];
    newMedia.splice(dragIndex, 1);
    newMedia.splice(hoverIndex, 0, dragItem);
    setSelectedMedia(newMedia);
  };

  const removeMedia = (id: string) => {
    setSelectedMedia((prevMedia) => prevMedia.filter((item) => item.id !== id));
  };

  console.log({ filteredAndSortedMedia });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-3xl mx-auto">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedMedia.length === 0 ? (
            <DialogTrigger asChild>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                <div className="flex flex-col items-center">
                  <Plus className="h-12 w-12 text-gray-400 stroke-1" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Add images, videos, or 3D models
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supported formats: PNG, JPG, GIF, MP4, WebM, GLB, GLTF
                  </p>
                </div>
              </div>
            </DialogTrigger>
          ) : null}
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Select file</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Search and filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <SortAsc className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('size')}>
                      Size
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setViewMode('grid')}>
                      Grid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setViewMode('list')}>
                      List
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      File type
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileType: 'JPG' }))
                      }
                    >
                      JPG
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileType: 'PNG' }))
                      }
                    >
                      PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileType: 'MP4' }))
                      }
                    >
                      MP4
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileType: 'GLTF' }))
                      }
                    >
                      GLTF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      File size
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileSize: 'small' }))
                      }
                    >
                      Small (&lt;1MB)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileSize: 'medium' }))
                      }
                    >
                      Medium (1MB-5MB)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, fileSize: 'large' }))
                      }
                    >
                      Large (&gt;5MB)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Used in
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, usedIn: 'Homepage' }))
                      }
                    >
                      Homepage
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          usedIn: 'Product Page',
                        }))
                      }
                    >
                      Product Page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, usedIn: 'Gallery' }))
                      }
                    >
                      Gallery
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      Product
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          productId: 'Nature Collection',
                        }))
                      }
                    >
                      Nature Collection
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          productId: 'Art Prints',
                        }))
                      }
                    >
                      Art Prints
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          productId: 'Space Collection',
                        }))
                      }
                    >
                      Space Collection
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <ScrollArea className="h-[300px] rounded-md border">
                <div className="p-4 space-y-4">
                  {/* Upload area */}
                  <div
                    {...getRootProps()}
                    className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center"
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm">
                          Add media
                        </Button>
                        <Popover
                          open={isAddFromUrlOpen}
                          onOpenChange={setIsAddFromUrlOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsAddFromUrlOpen(true);
                              }}
                            >
                              Add from URL
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium text-lg">
                                  Add media from URL
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Enter an image, YouTube, or Vimeo URL
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <Input
                                  id="url"
                                  placeholder="https://"
                                  value={urlInput}
                                  onChange={(e) => setUrlInput(e.target.value)}
                                  className="col-span-3"
                                />
                                <Button
                                  onClick={handleAddFromUrl}
                                  className="w-full"
                                  disabled={!urlInput}
                                >
                                  Add file
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {isDragActive
                          ? 'Release to add files'
                          : 'Drag and drop images, videos, 3D models, and files'}
                      </p>
                    </div>
                  </div>

                  {/* Media grid */}
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
                        : 'space-y-1'
                    }
                  >
                    {filteredAndSortedMedia &&
                    filteredAndSortedMedia.length > 0 ? (
                      filteredAndSortedMedia.map((item: Media) => (
                        <div
                          key={item.id}
                          className={cn(
                            viewMode === 'grid'
                              ? 'relative group cursor-pointer rounded-lg overflow-hidden'
                              : 'flex items-center gap-2 py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer',
                            selectedFiles.has(item.id) &&
                              'ring-2 ring-primary ring-offset-2'
                          )}
                          onClick={() => toggleFileSelection(item.id)}
                        >
                          <div
                            className={
                              viewMode === 'grid'
                                ? 'relative aspect-square rounded-md overflow-hidden border bg-muted'
                                : 'relative w-10 h-10 rounded-md overflow-hidden border bg-muted flex-shrink-0'
                            }
                          >
                            <Image
                              placeholder="blur"
                              blurDataURL={item.placeholder}
                              src={item.url}
                              alt={item.fileName}
                              className="w-full h-full object-cover"
                              width={104}
                              height={104}
                            />
                            {item.type !== MediaType.Photo && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                {item.type === MediaType.Video && (
                                  <Film className="h-6 w-6 text-white" />
                                )}
                                {item.type === MediaType.Model_3D && (
                                  <Cube className="h-6 w-6 text-white" />
                                )}
                              </div>
                            )}
                            {selectedFiles.has(item.id) && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div
                            className={
                              viewMode === 'grid'
                                ? 'mt-2 text-xs'
                                : 'flex-1 min-w-0'
                            }
                          >
                            <p className="font-medium truncate text-sm">
                              {item.fileName}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="truncate">{item.type}</span>
                              <span className="mx-1">•</span>
                              <span>
                                {(item.fileSize / 1000000).toFixed(2)} MB
                              </span>
                            </div>
                            {viewMode === 'list' && (
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <span className="truncate">
                                  Used in:{' '}
                                  {item.usedIn
                                    .map((u) => u.ownerTitle)
                                    .join(', ')}
                                </span>
                                <span className="mx-1">•</span>
                                <span className="truncate">
                                  Product: {item.product.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No media found. Try adjusting your filters or adding new
                        media.
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFiles(new Set());
                  setIsDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {selectedMedia.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedMedia.map((item, index) => (
                <MediaItem
                  key={item.id}
                  item={item}
                  index={index}
                  moveMedia={moveMedia}
                  removeMedia={removeMedia}
                  isFeatured={index === 0}
                />
              ))}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-6 w-6 text-gray-400 stroke-1" />
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}

function MediaItem({
  item,
  index,
  moveMedia,
  removeMedia,
  isFeatured = false,
}: any) {
  const [, ref] = useDrag({
    type: 'MEDIA_ITEM',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'MEDIA_ITEM',
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveMedia(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'video':
        return <Film className="h-6 w-6" />;
      case '3d':
        return <Cube className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div
      // @ts-expect-error - TS doesn't know about the ref function
      ref={(node) => ref(drop(node))}
      className={cn(
        'group relative rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer',
        isFeatured ? 'col-span-2 row-span-2' : ''
      )}
    >
      <img
        src={item.url}
        alt={item.name}
        className="w-full h-full object-cover rounded-lg"
      />
      {item.type !== 'image' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          {getMediaIcon(item.type)}
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center rounded-lg">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {getMediaIcon(item.type)}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          removeMedia(item.id);
        }}
      >
        <X className="h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
