<template>
  <div class="flex items-center bg-zinc-900 min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
    <div class="w-full text-center">
      <div class="space-y-8">
        <h1 class="text-5xl text-zinc-50 font-bold tracking-tighter sm:text-7xl transition-transform hover:scale-110">
          404
        </h1>
        <p class="text-zinc-500 text-lg sm:text-xl font-medium">
          Looks like you've ventured into the unknown digital realm.
        </p>
      </div>
      <div class="mt-4">
        <router-link to="/">
          <p
            class="inline-flex h-10 items-center rounded-md bg-zinc-100 px-8 text-sm font-medium text-zinc-950 shadow transition-colors hover:bg-zinc-100/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50">
            Return to website
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>
