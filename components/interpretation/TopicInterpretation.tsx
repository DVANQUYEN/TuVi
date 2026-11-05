'use client';

import { useState } from 'react';
import type { Topic, TopicInterpretation } from '@/lib/ziwei/interpretation/topic-interpretation';
import { CARD_VARIANT_CLASSES, CornerOrnaments } from '@/components/ui/Card';
import { HanIcon } from '@/components/ui/HanIcon';

interface TopicInterpretationProps {
  topics: TopicInterpretation[];
}

const TOPIC_HAN: Readonly<Record<Topic, string>> = {
  career: '官',
  love: '婚',
  wealth: '財',
  health: '疾',
};

export function TopicInterpretationTabs({ topics }: TopicInterpretationProps): React.ReactElement {
  const [activeTopic, setActiveTopic] = useState<Topic>(topics[0]?.topic ?? 'career');
  const currentTopic = topics.find((topic) => topic.topic === activeTopic) ?? topics[0];

  return (
    <section
      aria-labelledby="topic-interpretation-heading"
      className={`mb-8 rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES.ancient}`}
    >
      <CornerOrnaments size="md" />
      <h2
        id="topic-interpretation-heading"
        className="mb-4 flex items-center gap-2 font-serif text-xl font-bold md:text-2xl"
      >
        <HanIcon han="論" size="lg" />
        <span>Luận giải theo chủ đề</span>
      </h2>

      <div
        role="group"
        aria-label="Chọn chủ đề luận giải"
        className="mb-6 flex flex-wrap gap-2 border-b border-border-subtle"
      >
        {topics.map((topic) => (
          <button
            key={topic.topic}
            type="button"
            onClick={() => setActiveTopic(topic.topic)}
            aria-pressed={activeTopic === topic.topic}
            className={`flex items-center gap-1 px-4 py-2 font-medium transition-colors ${
              activeTopic === topic.topic
                ? 'border-b-2 border-gold text-gold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <HanIcon han={TOPIC_HAN[topic.topic]} size="sm" />
            <span>{topic.title}</span>
          </button>
        ))}
      </div>

      {currentTopic && (
        <div className="space-y-6">
          <p className="text-sm leading-relaxed">{currentTopic.overview}</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded bg-green-500/10 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-green-600">
                <HanIcon han="吉" size="sm" />
                <span>Điểm mạnh</span>
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {currentTopic.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
            <div className="rounded bg-yellow-500/10 p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-yellow-600">
                <HanIcon han="厄" size="sm" />
                <span>Thách thức</span>
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm">
                {currentTopic.challenges.map((challenge) => (
                  <li key={challenge}>{challenge}</li>
                ))}
              </ul>
            </div>
          </div>

          {currentTopic.suitableFields && currentTopic.suitableFields.length > 0 && (
            <TopicChips han="官" title="Ngành phù hợp" items={currentTopic.suitableFields} />
          )}

          {currentTopic.suitablePartner && currentTopic.suitablePartner.length > 0 && (
            <TopicChips han="婚" title="Loại người phù hợp" items={currentTopic.suitablePartner} />
          )}

          {currentTopic.incomeSources && currentTopic.incomeSources.length > 0 && (
            <TopicChips han="財" title="Nguồn thu nhập" items={currentTopic.incomeSources} />
          )}

          {currentTopic.healthConcerns && currentTopic.healthConcerns.length > 0 && (
            <TopicChips
              han="疾"
              title="Bệnh cần chú ý"
              items={currentTopic.healthConcerns}
              tone="danger"
            />
          )}

          <div>
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <HanIcon han="吉" size="sm" />
              <span>Lời khuyên</span>
            </h3>
            <ul className="list-inside list-disc space-y-1 text-sm">
              {currentTopic.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <YearChips
              han="吉"
              title="Năm may mắn"
              years={currentTopic.luckyYears}
              className="bg-green-500/10 text-green-600"
            />
            <YearChips
              han="厄"
              title="Năm thách thức"
              years={currentTopic.challengingYears}
              className="bg-red-500/10 text-red-600"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function TopicChips({
  han,
  title,
  items,
  tone = 'default',
}: {
  han: string;
  title: string;
  items: string[];
  tone?: 'default' | 'danger';
}): React.ReactElement {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-semibold">
        <HanIcon han={han} size="sm" />
        <span>{title}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded px-3 py-1 text-sm ${
              tone === 'danger' ? 'bg-red-500/10 text-red-600' : 'bg-elevated'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function YearChips({
  han,
  title,
  years,
  className,
}: {
  han: string;
  title: string;
  years: number[];
  className: string;
}): React.ReactElement {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 font-semibold">
        <HanIcon han={han} size="sm" />
        <span>{title}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {years.slice(0, 5).map((year) => (
          <span key={year} className={`rounded px-3 py-1 text-sm ${className}`}>
            {year}
          </span>
        ))}
      </div>
    </div>
  );
}
