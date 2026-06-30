# Contributing to FocusMon

Thanks for your interest in contributing to FocusMon! 🎯

## Getting Started

1. **Fork** the repo and clone it locally
2. 2. **Install dependencies**:
   3.    ```bash
            npm install
            cp .env.example .env
            ```
         3. **Run the app**:
         4.    ```bash
                  npm start        # Expo Go (scan QR)
                  npm run ios      # iOS simulator
                  npm run android  # Android emulator
                  ```

               > Supabase is optional — the app works fully offline with AsyncStorage. To enable sync, create a Supabase project, run `supabase/schema.sql`, and add your URL + anon key to `.env`.
               >
               > ## Good First Contributions
               >
               > - **New monster evolutions** — add art and leveling thresholds
               > - - **Push notifications** — focus reminders and streak alerts
               >   - - **Bug fixes** — check open [issues](https://github.com/sonnymay/focusomon/issues)
               >     - - **Tests** — unit tests for XP calculation, level logic, streak tracking
               >       - - **Docs** — improve README setup steps or add screenshots
               >        
               >         - ## Pull Request Guidelines
               >        
               >         - 1. Branch off `main`: `git checkout -b feat/your-feature`
               >           2. 2. Keep PRs focused — one feature or fix per PR
               >              3. 3. Follow existing patterns: functional components, Zustand stores, NativeWind styling
               >                 4. 4. Run `npx tsc` to check for TypeScript errors before submitting
               >                    5. 5. Describe what you changed and why in the PR description
               >                      
               >                       6. ## Code Style
               >                      
               >                       7. - **TypeScript** strict mode — no `any` without justification
               >                          - - **NativeWind** for styling — avoid inline StyleSheet where possible
               >                            - - **Zustand** for state — keep stores small and focused
               >                              - - **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
               >                               
               >                                - ## Questions?
               >                               
               >                                - Open an issue or reach out at sonnymaywi@gmail.com.
