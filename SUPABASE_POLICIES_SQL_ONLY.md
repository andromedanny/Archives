# Supabase Storage Policies - SQL Only

## Policy 1: Public Read Access

**Policy name:**
```
Public Read Access
```

**Allowed operation:**
- SELECT
- download
- getPublicUrl

**Target roles:**
- anon
- public

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

---

## Policy 2: Authenticated Upload

**Policy name:**
```
Authenticated Upload
```

**Allowed operation:**
- INSERT
- upload

**Target roles:**
- authenticated

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

---

## Policy 3: Authenticated Update Delete

**Policy name:**
```
Authenticated Update Delete
```

**Allowed operation:**
- UPDATE
- DELETE
- update
- remove

**Target roles:**
- authenticated

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

---

## Policy 4: Authenticated List

**Policy name:**
```
Authenticated List
```

**Allowed operation:**
- list

**Target roles:**
- authenticated

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

