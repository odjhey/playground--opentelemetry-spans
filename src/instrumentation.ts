/*instrumentation.ts*/
import 'dotenv/config'

import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
})

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: 'my-opentelemetry-setup',
})

sdk.start()

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) =>
      console.log('Error shutting down OpenTelemetry SDK', error)
    )
    .finally(() => process.exit(0))
})
