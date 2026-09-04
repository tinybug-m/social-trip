# Social Media Project Backlog

## 🧠 Overview

Short description of what this project is trying to achieve.

A social media platform for sharing posts, interacting with users, and building a feed-based experience.

---

## 🔴 Must Have (MVP)

### Auth

- [x] Sign up with email/password
- [x] Login
- [x] Logout
- [x] Persist session (middleware / SSR handling)

### Posts

- [x] Create post (image or video + caption + location)
- [ ] Delete post (own posts only)
- [x] Fetch posts (basic feed)

### Feed

- [x] Feed TopNavBar (smooth navigation)
- [x] Reels Feed
- [x] Explore Page

---

## 🟡 Should Have

### Engagement

- [x] Rate a post 1-5 stars (replaces like/unlike)
- [x] Comment on post, with replies (one level deep)
- [x] Like a comment
- [x] Edit your own comment (shows "Edited")
- [x] Delete your own comment
- [x] Share post (native share sheet / copy link)

All of the above needed three migration files in `supabase/migrations/`
(ratings/comments/location, grants, then comment replies/likes/edit) —
all three have been run and are confirmed working against the live DB.

### Profile

- [x] User profile page
- [x] Show user posts
- [x] Edit profile basics (username, bio, avatar photo — stored on the
      Supabase auth user, no extra table needed)

---

## 🟢 Nice to Have

- [ ] Follow / unfollow users
- [ ] Notifications system
- [ ] Search users/posts
- [ ] Trending feed

---

## 🧱 Technical Tasks

- [ ] Define database schema (users, posts, likes)
- [ ] Setup API layer structure
- [ ] Create reusable hooks (usePosts, useAuth)
- [ ] Setup error handling strategy
- [ ] Add loading states system

---

## 🚧 In Progress

- [ ] (only 1–2 tasks max here)

---

## ✅ Done

- [x] (keep updated manually)

---

## 🧭 Rules (VERY IMPORTANT)

- One task = one small action
- If a task takes more than 1–2 hours → break it
- Never start new feature until current one is "usable"
