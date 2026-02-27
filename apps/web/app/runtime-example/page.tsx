import { createRuntime, type RequestContext } from "@sdp/runtime";

/**
 * Force dynamic rendering - this page depends on runtime services
 * that require database connection at request time
 */
export const dynamic = 'force-dynamic';

/**
 * Singleton runtime - created once at module load
 * 
 * In a real app, you would import this from a separate file
 * that initializes it once (e.g., in layout.tsx or a lib file)
 */
const runtime = createRuntime();

/**
 * Runtime Example
 * 
 * This page demonstrates how to use the @sdp/runtime orchestrator
 * with singleton runtime + explicit context passing.
 * 
 * Key concepts:
 * 1. createRuntime() - Creates singleton (expensive ops like DB pools)
 * 2. Pass context explicitly to each service call
 * 3. Services use context for authorization and logging
 */
export default async function RuntimeExamplePage() {
  // Create context per request (would come from auth/session in real app)
  const context: RequestContext = {
    userId: "user-123",
    userRoles: ["admin", "user"],
    permissions: ["identitas:read", "identitas:write", "identitas:delete"],
    requestId: crypto.randomUUID(),
    startedAt: new Date(),
    ip: "127.0.0.1",
    userAgent: "Mozilla/5.0",
  };

  // Pass context explicitly to each service call
  const allIdentities = await runtime.identitasService.getAll(context, 10);
  const exists = await runtime.identitasService.exists(context, "12345");
  const identity = await runtime.identitasService.getById(context, "12345");
  const totalCount = await runtime.identitasService.count(context);
  const searchResults = await runtime.identitasService.search(context, "john");

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">SDP Runtime Example</h1>
      
      <div className="space-y-8">
        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pattern: Singleton Runtime + Explicit Context</h2>
          <div className="space-y-2 text-gray-600">
            <p><code>createRuntime()</code> - Creates singleton (called once at app startup)</p>
            <p><code>runtime.identitasService.getById(ctx, id)</code> - Pass context explicitly</p>
            <p><code>runtime.identitasService.getAll(ctx, limit, offset)</code> - Pass context explicitly</p>
          </div>
        </section>

        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Request Context</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{JSON.stringify({
  userId: context.userId,
  userRoles: context.userRoles,
  permissions: context.permissions,
  requestId: context.requestId,
}, null, 2)}
          </pre>
        </section>

        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Example Operations</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Count: {totalCount}</h3>
              <p className="text-sm text-gray-500">Total number of identities</p>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Exists &quot;12345&quot;: {exists ? "Yes" : "No"}</h3>
              <p className="text-sm text-gray-500">Check if identity exists</p>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Identity &quot;12345&quot;:</h3>
              <pre className="text-sm text-gray-600 mt-2 overflow-x-auto">
                {JSON.stringify(identity, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium">First 10 Identities:</h3>
              <p className="text-sm text-gray-500 mb-2">
                Total: {allIdentities.total}, Returned: {allIdentities.data.length}
              </p>
              <pre className="text-sm text-gray-600 mt-2 overflow-x-auto max-h-60">
                {JSON.stringify(allIdentities.data, null, 2)}
              </pre>
            </div>

            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium">Search &quot;john&quot;:</h3>
              <pre className="text-sm text-gray-600 mt-2 overflow-x-auto">
                {JSON.stringify(searchResults, null, 2)}
              </pre>
            </div>
          </div>
        </section>

        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Usage Code</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// 1. Create singleton runtime (once at app startup)
import { createRuntime } from "@sdp/runtime";
const runtime = createRuntime();

// 2. Create context per request (from auth/session)
const context = {
  userId: "user-123",
  userRoles: ["admin"],
  permissions: ["identitas:read", "identitas:write"],
  requestId: crypto.randomUUID(),
  startedAt: new Date(),
};

// 3. Pass context explicitly to each service call
const result = await runtime.identitasService.getAll(context, 10);
const exists = await runtime.identitasService.exists(context, "12345");
const identity = await runtime.identitasService.getById(context, "12345");`}
          </pre>
        </section>

        <section className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Authorization Demo</h2>
          <p className="text-gray-600 mb-4">
            Try removing <code>identitas:delete</code> from permissions and calling 
            <code>runtime.identitasService.delete(context, "12345")</code> - it will throw "Forbidden" error.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">
              Current permissions: {context.permissions.join(', ')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
