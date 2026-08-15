# Upgrade Plan: brundavan-backend (20260812134315)

- **Generated**: 2026-08-12 13:43:15
- **HEAD Branch**: N/A
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- JDK 21: not available (baseline will be skipped)
- JDK 25: C:\Program Files\Java\jdk-25\bin (detected)

**Build Tools**
- Maven 3.9.16: C:\Program Files (x86)\apache-maven-3.9.16\bin
- Maven Wrapper: 3.9.16 (distributionUrl points to apache-maven-3.9.16)

## Guidelines

- Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260812134315
- Run tests before and after the upgrade: true

## Upgrade Goals

- Java: upgrade from 21 → 25 (user requested: latest LTS)

## Technology Stack

| Technology/Dependency    | Current | Min Compatible | Why Incompatible |
| ------------------------ | ------- | -------------- | ---------------- |
| Java                     | 21      | 25             | User requested (move to latest LTS)
| Spring Boot              | 4.1.1-SNAPSHOT | 4.1.1-SNAPSHOT | Project already uses Spring Boot 4.x snapshot
| Maven (wrapper)          | 3.9.16  | 3.9.16         | Wrapper and system Maven are compatible with Java 25

## Derived Upgrades

- None required beyond setting the `java.version` to 25. Maven wrapper (3.9.16) is already adequate for Java 25.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|------------|---------|--------|--------|--------|
| pom.xml | property `java.version` | 21 | upgrade | 25 | Align project source/target to latest LTS JDK installed on the system |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| pom.xml | `<properties>` | `<java.version>21</java.version>` | Change to `<java.version>25</java.version>` | Align build with target JDK |

### Configuration Changes

- No `application.properties` or other runtime config changes anticipated for a pure JDK lift.

### CI/CD Changes

- None detected in repository files; if external CI references Java 21, update pipeline after upgrade.

### Risks & Warnings

- Base JDK 21 is not installed on the host; baseline compile/test will be skipped (baseline skipped).
- Project uses a Spring Boot `4.1.1-SNAPSHOT` parent; snapshot artifacts may produce transient resolution issues — network access to snapshot repo is required (repo.spring.io/snapshot is configured).
- Repository is not under version control locally (`git` not available); changes will be made directly to the working tree. Record: changes are not version-controlled.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: Ensure required JDKs/build tools available for the upgrade steps
  - **Changes to Make**: Verify JDK 25 and Maven 3.9.16 are usable; nothing to install (JDK 25 present)
  - **Verification**: `mvn -v` with JDK 25 on PATH, expected: Maven runs, Java 25 reported

- Step 2: Setup Baseline (skipped if base JDK unavailable)
  - **Rationale**: Capture pre-upgrade test baseline when base JDK available
  - **Changes to Make**: Run baseline build/tests with current project settings (if JDK 21 present)
  - **Verification**: `./mvnw -q clean test` — SKIPPED since JDK 21 not available

- Step 3: Bump `java.version` in `pom.xml` to 25
  - **Rationale**: Align compilation and runtime target to Java 25
  - **Changes to Make**: Update `<java.version>` property in `pom.xml`
  - **Verification**: `./mvnw -q -DskipTests=false clean test-compile` using JDK 25 (expect compile success)

- Step 4: Run full test suite and fix failures
  - **Rationale**: Ensure project compiles and tests pass under Java 25
  - **Changes to Make**: Code fixes if any Java-25-specific issues appear
  - **Verification**: `./mvnw -q clean test` using JDK 25 — expected: 100% tests pass

- Step 5: CVE scan & fixes
  - **Rationale**: Validate direct dependencies for known CVEs and remediate
  - **Changes to Make**: Run dependency list and call validator; bump versions if needed
  - **Verification**: `mvn dependency:list -DexcludeTransitive=true` and re-scan until no actionable CVEs remain

- Step 6: Final validation & summary
  - **Rationale**: Produce `summary.md` and finish session
  - **Changes to Make**: Collect results, recording that git was not available
  - **Verification**: All steps marked complete; tests green; summary generated

---

> Notes:
> - Because Git is not available locally, this plan will modify files in-place; please copy or back up the working tree if you need version control history.
> - Tests will be run using the Maven wrapper (`./mvnw`) where available; system `mvn` may also be used.
