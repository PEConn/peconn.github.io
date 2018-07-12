// TODO: Do something with modules here instead.

function getFlags(){
    return [
        {
            'name': 'FLAG_ACTIVITY_BROUGHT_TO_FRONT',
            'value': '0x00400000',
            'description': `
<p>This flag is not normally set by application code, but set for you by
the system as described in the
<code><a href="https://developer.android.com/reference/android/R.styleable.html#AndroidManifestActivity_launchMode">launchMode</a></code> documentation for the singleTask mode.
</p>
           `,
        },
        {
            'name': 'FLAG_ACTIVITY_CLEAR_TASK',
            'value': '0x00008000',
            'description': `
<p>If set in an Intent passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity()</a></code>,
this flag will cause any existing task that would be associated with the
activity to be cleared before the activity is started.  That is, the activity
becomes the new root of an otherwise empty task, and any old activities
are finished.  This can only be used in conjunction with <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code>.
</p>
           `,
        },
        {
            'name': 'FLAG_ACTIVITY_CLEAR_TOP',
            'value': '0x04000000',
            'description': `
<p>If set, and the activity being launched is already running in the
current task, then instead of launching a new instance of that activity,
all of the other activities on top of it will be closed and this Intent
will be delivered to the (now on top) old activity as a new Intent.

</p>

<p>For example, consider a task consisting of the activities: A, B, C, D.
If D calls startActivity() with an Intent that resolves to the component
of activity B, then C and D will be finished and B receive the given
Intent, resulting in the stack now being: A, B.

</p>
<p>The currently running instance of activity B in the above example will
either receive the new intent you are starting here in its
onNewIntent() method, or be itself finished and restarted with the
new intent.  If it has declared its launch mode to be "multiple" (the
default) and you have not set <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_SINGLE_TOP">FLAG_ACTIVITY_SINGLE_TOP</a></code> in
the same intent, then it will be finished and re-created; for all other
launch modes or if <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_SINGLE_TOP">FLAG_ACTIVITY_SINGLE_TOP</a></code> is set then this
Intent will be delivered to the current instance's onNewIntent().

</p>
<p>This launch mode can also be used to good effect in conjunction with
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code>: if used to start the root activity
of a task, it will bring any currently running instance of that task
to the foreground, and then clear it to its root state.  This is
especially useful, for example, when launching an activity from the
notification manager.

</p>
<p>See
<a href="https://developer.android.com/guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
Stack</a> for more information about tasks.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_CLEAR_WHEN_TASK_RESET',
            'value': '0x00080000',
            'description': `<p>Deprecated, use FLAG_ACTIVITY_NEW_DOCUMENT.</p>`
        },
        {
            'name': 'FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS',
            'value': '0x00800000',
            'description': `
<p>If set, the new activity is not kept in the list of recently launched
activities.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_FORWARD_RESULT',
            'value': '0x02000000',
            'description': `
<p>If set and this intent is being used to launch a new activity from an
existing one, then the reply target of the existing activity will be
transfered to the new activity.  This way the new activity can call
<code><a href="https://developer.android.com/reference/android/app/Activity.html#setResult(int)">Activity.setResult(int)</a></code> and have that result sent back to
the reply target of the original activity.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY',
            'value': '0x00100000',
            'description': `
<p>This flag is not normally set by application code, but set for you by
the system if this activity is being launched from history
(longpress home key).
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_LAUNCH_ADJACENT',
            'value': '0x00001000',
            'description': `
<p>This flag is only used in split-screen multi-window mode. The new activity will be displayed
adjacent to the one launching it. This can only be used in conjunction with
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code>. Also, setting <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_MULTIPLE_TASK">FLAG_ACTIVITY_MULTIPLE_TASK</a></code> is
required if you want a new instance of an existing activity to be created.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_MATCH_EXTERNAL',
            'value': '0x00000800',
            'description': `
<p>If set in an Intent passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity()</a></code>,
this flag will attempt to launch an instant app if no full app on the device can already
handle the intent.
</p>
<p>
When attempting to resolve instant apps externally, the following <code><a href="https://developer.android.com/reference/android/content/Intent.html">Intent</a></code> properties
are supported:
</p>
<ul>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#setAction(java.lang.String)">setAction(String)</a></code></li>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#addCategory(java.lang.String)">addCategory(String)</a></code></li>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#setData(android.net.Uri)">setData(Uri)</a></code></li>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#setType(java.lang.String)">setType(String)</a></code></li>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#setPackage(java.lang.String)">setPackage(String)</a></code></li>
<li><code><a href="https://developer.android.com/reference/android/content/Intent.html#addFlags(int)">addFlags(int)</a></code></li>
</ul>
<p>
In the case that no instant app can be found, the installer will be launched to notify the
user that the intent could not be resolved. On devices that do not support instant apps,
the flag will be ignored.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_MULTIPLE_TASK',
            'value': '0x08000000',
            'description': `
<p>This flag is used to create a new task and launch an activity into it.
This flag is always paired with either <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_DOCUMENT">FLAG_ACTIVITY_NEW_DOCUMENT</a></code>
or <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code>. In both cases these flags alone would
search through existing tasks for ones matching this Intent. Only if no such
task is found would a new task be created. When paired with
FLAG_ACTIVITY_MULTIPLE_TASK both of these behaviors are modified to skip
the search for a matching task and unconditionally start a new task.

<strong>When used with <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code> do not use this
flag unless you are implementing your own
top-level application launcher.</strong>  Used in conjunction with
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code> to disable the
behavior of bringing an existing task to the foreground.  When set,
a new task is <em>always</em> started to host the Activity for the
Intent, regardless of whether there is already an existing task running
the same thing.

</p>
<p><strong>Because the default system does not include graphical task management,
you should not use this flag unless you provide some way for a user to
return back to the tasks you have launched.</strong>

See <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_DOCUMENT">FLAG_ACTIVITY_NEW_DOCUMENT</a></code> for details of this flag's use for
creating new document tasks.

</p>
<p>This flag is ignored if one of <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code> or
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_DOCUMENT">FLAG_ACTIVITY_NEW_DOCUMENT</a></code> is not also set.

</p>
<p>See
<a href="https://developer.android.com/guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
Stack</a> for more information about tasks.</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_NEW_DOCUMENT',
            'value': '0x00080000',
            'description': `
<p>This flag is used to open a document into a new task rooted at the activity launched
by this Intent. Through the use of this flag, or its equivalent attribute,
<code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code> multiple instances of the same activity
containing different documents will appear in the recent tasks list.

</p>
<p>The use of the activity attribute form of this,
<code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code>, is
preferred over the Intent flag described here. The attribute form allows the
Activity to specify multiple document behavior for all launchers of the Activity
whereas using this flag requires each Intent that launches the Activity to specify it.

</p>
<p>Note that the default semantics of this flag w.r.t. whether the recents entry for
it is kept after the activity is finished is different than the use of
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code> and <code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code> -- if
this flag is being used to create a new recents entry, then by default that entry
will be removed once the activity is finished.  You can modify this behavior with
<code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_RETAIN_IN_RECENTS">FLAG_ACTIVITY_RETAIN_IN_RECENTS</a></code>.

</p>
<p>FLAG_ACTIVITY_NEW_DOCUMENT may be used in conjunction with <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_MULTIPLE_TASK">FLAG_ACTIVITY_MULTIPLE_TASK</a></code>. When used alone it is the
equivalent of the Activity manifest specifying <code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code>="intoExisting". When used with
FLAG_ACTIVITY_MULTIPLE_TASK it is the equivalent of the Activity manifest specifying
<code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code>="always".

Refer to <code><a href="https://developer.android.com/reference/android/R.attr.html#documentLaunchMode">R.attr.documentLaunchMode</a></code> for more information.</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_NEW_TASK',
            'value': '0x10000000',
            'description': `
<p>If set, this activity will become the start of a new task on this
history stack.  A task (from the activity that started it to the
next task activity) defines an atomic group of activities that the
user can move to.  Tasks can be moved to the foreground and background;
all of the activities inside of a particular task always remain in
the same order.  See
<a href="https://developer.android.com/guide/topics/fundamentals/tasks-and-back-stack.html">Tasks and Back
Stack</a> for more information about tasks.

</p>
<p>This flag is generally used by activities that want
to present a "launcher" style behavior: they give the user a list of
separate things that can be done, which otherwise run completely
independently of the activity launching them.

</p>
<p>When using this flag, if a task is already running for the activity
you are now starting, then a new activity will not be started; instead,
the current task will simply be brought to the front of the screen with
the state it was last in.  See <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_MULTIPLE_TASK">FLAG_ACTIVITY_MULTIPLE_TASK</a></code> for a flag
to disable this behavior.

</p>
<p>This flag can not be used when the caller is requesting a result from
the activity being launched.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_NO_ANIMATION',
            'value': '0x00010000',
            'description': `
<p>If set in an Intent passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity()</a></code>,
this flag will prevent the system from applying an activity transition
animation to go to the next activity state.  This doesn't mean an
animation will never run -- if another activity change happens that doesn't
specify this flag before the activity started here is displayed, then
that transition will be used.  This flag can be put to good use
when you are going to do a series of activity operations but the
animation seen by the user shouldn't be driven by the first activity
change but rather a later one.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_NO_HISTORY',
            'value': '0x40000000',
            'description': `
<p>If set, the new activity is not kept in the history stack.  As soon as
the user navigates away from it, the activity is finished.  This may also
be set with the <code><a href="https://developer.android.com/reference/android/R.styleable.html#AndroidManifestActivity_noHistory">noHistory</a></code> attribute.

</p>
<p>If set, <code><a href="https://developer.android.com/reference/android/app/Activity.html#onActivityResult(int,%20int,%20android.content.Intent)">onActivityResult()</a></code>
is never invoked when the current activity starts a new activity which
sets a result and finishes.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_NO_USER_ACTION',
            'value': '0x00040000',
            'description': `
<p>If set, this flag will prevent the normal <code><a href="https://developer.android.com/reference/android/app/Activity.html#onUserLeaveHint()">Activity.onUserLeaveHint()</a></code>
callback from occurring on the current frontmost activity before it is
paused as the newly-started activity is brought to the front.

</p>
<p>Typically, an activity can rely on that callback to indicate that an
explicit user action has caused their activity to be moved out of the
foreground. The callback marks an appropriate point in the activity's
lifecycle for it to dismiss any notifications that it intends to display
"until the user has seen them," such as a blinking LED.

</p>
<p>If an activity is ever started via any non-user-driven events such as
phone-call receipt or an alarm handler, this flag should be passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity</a></code>, ensuring that the pausing
activity does not think the user has acknowledged its notification.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_PREVIOUS_IS_TOP',
            'value': '0x01000000',
            'description': `
<p>If set and this intent is being used to launch a new activity from an
existing one, the current activity will not be counted as the top
activity for deciding whether the new intent should be delivered to
the top instead of starting a new one.  The previous activity will
be used as the top, with the assumption being that the current activity
will finish itself immediately.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_REORDER_TO_FRONT',
            'value': '0x00020000',
            'description': `
<p>If set in an Intent passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity()</a></code>,
this flag will cause the launched activity to be brought to the front of its
task's history stack if it is already running.

</p>
<p>For example, consider a task consisting of four activities: A, B, C, D.
If D calls startActivity() with an Intent that resolves to the component
of activity B, then B will be brought to the front of the history stack,
with this resulting order:  A, C, D, B.

This flag will be ignored if <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_CLEAR_TOP">FLAG_ACTIVITY_CLEAR_TOP</a></code> is also
specified.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_RESET_TASK_IF_NEEDED',
            'value': '0x00200000',
            'description': `
<p>If set, and this activity is either being started in a new task or
bringing to the top an existing task, then it will be launched as
the front door of the task.  This will result in the application of
any affinities needed to have that task in the proper state (either
moving activities to or from it), or simply resetting that task to
its initial state if needed.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_RETAIN_IN_RECENTS',
            'value': '0x00002000',
            'description': `
<p>By default a document created by <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_DOCUMENT">FLAG_ACTIVITY_NEW_DOCUMENT</a></code> will
have its entry in recent tasks removed when the user closes it (with back
or however else it may finish()). If you would like to instead allow the
document to be kept in recents so that it can be re-launched, you can use
this flag. When set and the task's activity is finished, the recents
entry will remain in the interface for the user to re-launch it, like a
recents entry for a top-level application.
</p>
<p>
The receiving activity can override this request with
<code><a href="https://developer.android.com/reference/android/R.attr.html#autoRemoveFromRecents">R.attr.autoRemoveFromRecents</a></code> or by explcitly calling
<code><a href="https://developer.android.com/reference/android/app/Activity.html#finishAndRemoveTask()">Activity.finishAndRemoveTask()</a></code>.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_SINGLE_TOP',
            'value': '0x20000000',
            'description': `
<p>If set, the activity will not be launched if it is already running
at the top of the history stack.
</p>
            `
        },
        {
            'name': 'FLAG_ACTIVITY_TASK_ON_HOME',
            'value': '0x00004000',
            'description': `
<p>If set in an Intent passed to <code><a href="https://developer.android.com/reference/android/content/Context.html#startActivity(android.content.Intent)">Context.startActivity()</a></code>,
this flag will cause a newly launching task to be placed on top of the current
home activity task (if there is one).  That is, pressing back from the task
will always return the user to home even if that was not the last activity they
saw.   This can only be used in conjunction with <code><a href="https://developer.android.com/reference/android/content/Intent.html#FLAG_ACTIVITY_NEW_TASK">FLAG_ACTIVITY_NEW_TASK</a></code>.
</p>
            `
        },
    ].sort(function(a, b) {
        return parseInt(b.value) - parseInt(a.value);
    });
}
