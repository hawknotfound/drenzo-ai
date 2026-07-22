# System Design

Architecting scalable, reliable, maintainable systems — from single server to distributed global infrastructure.

## Core Principles

**Scalability:** Handle more load gracefully. Vertical (bigger machine) vs horizontal (more machines).

**Reliability:** System works correctly and continuously. Redundancy, failover, graceful degradation.

**Availability:** Uptime percentage. 99.9% (three nines) = ~8.7h/year downtime. 99.99% = ~52min/year.

**Maintainability:** Code and systems that are easy to understand, modify, and operate.

## Building Blocks

**DNS:** Route traffic to services. Load balancing at the domain level.

**Load Balancers:** Distribute traffic across servers. Algorithms: round-robin, least connections, IP hash.

**Databases:** SQL (ACID) vs NoSQL (eventual consistency). Read replicas, sharding, indexing strategies.

**Caching:** Redis/Memcached. Cache-aside, write-through, write-behind patterns. Cache invalidation is hard.

**Queues:** RabbitMQ, Kafka, SQS. Decouple producers and consumers. Handle spikes gracefully.

**CDN:** Serve static assets from edge locations. Reduce latency, offload origin servers.

**Microservices:** Decompose by business capability. Independent deploy, scale, and own.

## Design Process

1. Understand requirements (functional + non-functional)
2. Estimate scale (traffic, storage, bandwidth)
3. Define data model
4. Design high-level architecture
5. Deep dive on key components
6. Identify bottlenecks and tradeoffs

## Common Patterns

- Write-ahead log (WAL) for durability
- Event sourcing — store changes, not current state
- CQRS — separate read and write models
- Circuit breaker — fail fast when downstream is down
- Rate limiting — protect against abuse
- Idempotency — same request processed once
