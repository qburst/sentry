import {EventDataSection} from 'sentry/components/events/eventDataSection';
import KeyValueList from 'sentry/components/events/interfaces/keyValueList';
import {Event, Group} from 'sentry/types';
import {getConfigForIssueType} from 'sentry/utils/issueTypeConfig';

type EvidenceProps = {event: Event; group?: Group};

/**
 * This component is rendered whenever an `event.occurrence.evidenceDisplay` is present,
 * _except_ for performance issues. Performance issues will render this info in `spanEvidence.tsx`.
 *
 * When we figure out how we want to genericize the UI for performance issues we can revisit.
 */
export const EventEvidence = ({event, group}: EvidenceProps) => {
  const evidenceDisplay = event.occurrence?.evidenceDisplay;

  if (!group || !evidenceDisplay?.length || !getConfigForIssueType(group).evidence) {
    return null;
  }

  return (
    <EventDataSection title="Evidence" type="evidence">
      <KeyValueList
        data={evidenceDisplay.map(item => ({
          subject: item.name,
          key: item.name,
          value: item.value,
        }))}
        shouldSort={false}
      />
    </EventDataSection>
  );
};
