import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/recentNotes.scss"
import { Date, ValidDateType } from "./Date"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  scrollable: boolean
  dateType: ValidDateType
  filter: (f: QuartzPluginData) => boolean
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

function getDateByType(
  data: QuartzPluginData,
  dateType: ValidDateType,
): globalThis.Date | undefined {
  return data.dates?.[dateType]
}

function byDateTypeAndAlphabetical(dateType: ValidDateType) {
  return (f1: QuartzPluginData, f2: QuartzPluginData) => {
    const f1Date = getDateByType(f1, dateType)
    const f2Date = getDateByType(f2, dateType)

    if (f1Date && f2Date) {
      return f2Date.getTime() - f1Date.getTime()
    } else if (f1Date && !f2Date) {
      return -1
    } else if (!f1Date && f2Date) {
      return 1
    }

    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

const defaultOptions = (): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  scrollable: false,
  dateType: "created",
  filter: () => true,
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(), ...userOpts }
    const sort = opts.sort ?? byDateTypeAndAlphabetical(opts.dateType)
    const pages = allFiles.filter(opts.filter).sort(sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    return (
      <div class={classNames(displayClass, "recent-notes", opts.scrollable ? "scrollable" : "")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.recentNotes.title}</h3>
        <ul class="recent-ul">
          {pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const tags = page.frontmatter?.tags ?? []
            const date = getDateByType(page, opts.dateType)

            return (
              <li class="recent-li">
                <div class="section">
                  <div class="desc">
                    <h3>
                      <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                        {title}
                      </a>
                    </h3>
                  </div>
                  {date && (
                    <p class="meta">
                      <Date date={date} locale={cfg.locale} />
                    </p>
                  )}
                  {opts.showTags && (
                    <ul class="tags">
                      {tags.map((tag) => (
                        <li>
                          <a
                            class="internal tag-link"
                            href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                          >
                            {tag}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {opts.linkToMore && remaining > 0 && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              {i18n(cfg.locale).components.recentNotes.seeRemainingMore({ remaining })}
            </a>
          </p>
        )}
      </div>
    )
  }

  RecentNotes.css = style
  return RecentNotes
}) satisfies QuartzComponentConstructor
